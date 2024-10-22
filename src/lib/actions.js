"use server";
import { getUserByEmail, getUserById } from "@/data/user";
import {
  forgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  SettingsSchema,
  SettingsSchema2,
} from "@/Schemas";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";

import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTokenByToken } from "@/data/verification-token";
import { getPasswordTokenByToken } from "@/data/reset-password-token";
import { getTwoFactorByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationbyUserId } from "@/data/two-factor-confirmation";
import { signOut } from "@/auth";
import { getCurrentUser } from "./getCurrentUser";
import { UserRole } from "@prisma/client";

//utils functions
export const hashPassword = async (password, saltRounds = 10) => {
  const newSalt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, newSalt);
  if (!hashedPassword) {
    throw new Error("hashing password failed");
  }
  return hashedPassword;
};

//actions
export const login = async (values, callbackUrl = "") => {
  //CHECK THE VALUES BEFORE USING IT
  const validValues = LoginSchema.safeParse(values);
  console.log(validValues);
  if (!validValues.success) {
    return { error: "Invalid Credentials" };
  }
  const { email, password, code } = validValues.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }

  //HANDLES EMAIL VERIFIcaTION
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent" };
  }
  //HANDLES 2FA TOKENS AND VERIFICATION
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorByEmail(existingUser.email);

      if (!twoFactorToken) {
        console.log("NO TWO FACTOR");
        return { error: "Invalid code" };
      }
      if (twoFactorToken.token !== code) {
        console.log("KKKK" + twoFactorToken + " " + code);
        console.log("DOESNT MATCH");
        return { error: "Invalid code" };
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      //VERIFY CODE
      if (hasExpired) {
        return { error: "Code expired!" };
      }

      //REMOVE 2FA TOKEN and old 2FA CONFIRMATION IF EXISTS
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationbyUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      //CREATE A NEW 2FA CONFIRMATION

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
      //THE SIGN IN PROCESS CONTINUES
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }
  //HANDLES SIGN IN PROCESS
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "invalid credentials" };
        default:
          return { error: "Somth went wrong!" };
      }
    }
    throw error; //IDk dont redirect without this
  }
};

export const register = async (values) => {
  const validValues = RegisterSchema.safeParse(values);
  console.log(validValues);
  if (!validValues.success) {
    return { error: "Invalid Credentials" };
  }
  const { username, email, password } = validValues.data;
  const hashedPassword = await hashPassword(password);

  const userInDb = await getUserByEmail(email);

  if (userInDb) {
    return { error: "Email already in use" };
  }
  await db.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
    },
  });
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Email sent for verification" };
};

export const newVerification = async (token) => {
  console.log({ TOKEN: token });
  const existingToken = await getTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist" };
  }
  // Check if the token has expired
  const currentTime = new Date();
  if (new Date(existingToken.expires) < currentTime) {
    return { error: "Token has already expired." };
  }
  // Find the user associated with the email
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist." };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: currentTime, // Set verification time to now
      email: existingToken.email, // Update email in case it has changed
    },
  });
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });
  console.log("IM here");
  return { success: "Email verificated" };
};

export const setNewPassword = async (password, token) => {
  console.log(token);
  const validValues = forgotPasswordSchema.safeParse(password);
  if (!validValues.success) {
    console.log("INVALID VALUES");
    return null;
  }
  try {
    const { password } = validValues.data;
    const hashedPassword = await hashPassword(password);
    const newPasswordTokenn = await getPasswordTokenByToken(token);
    const date = new Date();
    if (newPasswordTokenn && date < newPasswordTokenn.expires) {
      const newUser = await db.user.update({
        where: { email: newPasswordTokenn.email },
        data: {
          password: hashedPassword,
        },
      });
      await db.newPasswordToken.delete({
        where: { id: newPasswordTokenn.id },
      });

      return newUser;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const logout = async () => {
  //Do some server stuff
  await signOut({ redirectTo: "/auth/login" });
};

export const admin = async () => {
  const role = await getCurrentUser().role;

  if (role === UserRole.ADMIN) {
    return { success: "You are allowed" };
  }
  return { error: "You are not allowed!" };
};

export const settings = async (values) => {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "unauthorized" };
  }
  if (user.isOauth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  //IF they change the email, they have to verify it

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification Email sent" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const matchPasswords = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!matchPasswords) {
      return { error: "Invalid Password" };
    }
    const hashedPassword = await hashPassword(values.newPassword);

    values.password = hashedPassword;
  }

  const { newPassword, ...restOfTheValues } = values;
  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...restOfTheValues,
    },
  });

  console.log(values);

  return { success: "Settings updated" };
};
