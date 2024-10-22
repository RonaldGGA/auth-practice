import { db } from "@/lib/db";

export const getTokenByToken = async (token) => {
  try {
    console.log(token);
    const verificationToken = await db.verificationToken.findFirst({
      where: { token: token },
    });
    if (!verificationToken) {
      return null;
    }
    return verificationToken;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const getTokenByEmail = async (email) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email: email },
    });
    if (!verificationToken) {
      return null;
    }
    return verificationToken;
  } catch {
    console.log("TOKEN NOT FOUND BY EMAIL");

    return null;
  }
};
