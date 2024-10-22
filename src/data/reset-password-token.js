"use server";
const { db } = require("@/lib/db");

export const getPasswordTokenByEmail = async (email) => {
  console.log("IM HERE", email);
  try {
    const passwordToken = await db.newPasswordToken.findFirst({
      where: { email: email },
    });
    if (!passwordToken) {
      return null;
    }
    console.log(passwordToken);

    return passwordToken;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const getPasswordTokenByToken = async (token) => {
  try {
    const passwordToken = await db.newPasswordToken.findUnique({
      where: { token },
    });
    if (!passwordToken) {
      return null;
    }
    console.log(passwordToken);
    return passwordToken;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
