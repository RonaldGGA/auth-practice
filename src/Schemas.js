import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string()),
    password: z.optional(z.string()),
    newPassword: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (
        (data.password && !data.newPassword) ||
        (!data.password && data.newPassword)
      ) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  );

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string(),
  code: z.optional(z.string()),
});

export const forgotPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "The password must be at least 8 characters long." })
    .regex(/[a-z]/, {
      message: "The password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "The password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "The password must contain at least one number.",
    })
    .regex(/[@$!%*?&]/, {
      message: "The password must contain at least one special character.",
    }),
});

export const forgotPasswordEmailSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const RegisterSchema = z.object({
  username: z.string().min(3),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(8, { message: "The password must be at least 8 characters long." })
    .regex(/[a-z]/, {
      message: "The password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "The password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "The password must contain at least one number.",
    })
    .regex(/[@$!%*?&]/, {
      message: "The password must contain at least one special character.",
    }),
});
