import { db } from "@/lib/db";

export const getTwoFactorConfirmationbyUserId = async (userId) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });
    if (!twoFactorConfirmation) {
      return null;
    }
    return twoFactorConfirmation;
  } catch (error) {
    console.log({ error: error.message });
    return null;
  }
};
