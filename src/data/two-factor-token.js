import { db } from "@/lib/db";

export const getTwoFactorByEmail = async (email) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });

    return twoFactorToken;
  } catch (error) {
    console.log({ error: error.message });
    return null;
  }
};
export const getTwoFactorByToken = async (token) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });

    return twoFactorToken;
  } catch (error) {
    console.log({ error: error.message });
    return null;
  }
};
