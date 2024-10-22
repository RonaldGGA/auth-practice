"use server";

import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { getTokenByEmail } from "@/data/verification-token";
import { db } from "@/lib/db";
import { getPasswordTokenByEmail } from "@/data/reset-password-token";
import { forgotPasswordEmailSchema } from "@/Schemas";
import { getTwoFactorByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";

export const generateVerificationToken = async (email) => {
  try {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour in milliseconds
    const existingToken = await getTokenByEmail(email);

    if (existingToken) {
      await db.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return verificationToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generatePasswordToken = async (values) => {
  const validEmail = forgotPasswordEmailSchema.safeParse(values);
  if (!validEmail.success) {
    console.log("INVALID VALUES");
    return null;
  }
  const { email } = validEmail.data;
  console.log(email);
  try {
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600 * 1000); // Setting expiration for 1 hour

    const existingPasswordToken = await getPasswordTokenByEmail(email);

    // If there is an existing token, delete it
    if (existingPasswordToken) {
      await db.newPasswordToken.delete({
        where: {
          id: existingPasswordToken.id,
        },
      });
    }

    // Create a new password token in the database
    const newPasswordToken = await db.newPasswordToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    console.log("New Password Token Created:", newPasswordToken); // Log for confirmation
    return newPasswordToken;
  } catch (error) {
    console.error("Error generating password token:", error.message); // More descriptive error logging
    return null;
  }
};

export const generateTwoFactorToken = async (email) => {
  const token = crypto.randomInt(100_000, 1_000_001).toString(); //6 digits random number
  const expires = new Date(new Date(new Date().getTime() + 3600 * 1000));

  try {
    const userExists = await getUserByEmail(email);
    if (!userExists) {
      console.log({ error: "USER DOESNT EXISTS" });
      return null;
    }
    const twoFactorTokenExists = await getTwoFactorByEmail(email);
    if (twoFactorTokenExists) {
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorTokenExists.id,
        },
      });
    }
    const twoFactorToken = await db.twoFactorToken.create({
      data: {
        token,
        email,
        expires,
      },
    });
    return twoFactorToken;
  } catch (error) {
    console.log({ error: error.message });
    return null;
  }
};
