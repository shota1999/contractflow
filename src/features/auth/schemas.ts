import { z } from "zod";

const optionalTrimmedText = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  },
  z.string().min(2, "Must be at least 2 characters.").optional(),
);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must include at least one letter.")
  .regex(/\d/, "Password must include at least one number.");

export const registerSchema = z.object({
  name: optionalTrimmedText,
  email: z.string().trim().email("Enter a valid email address."),
  password: passwordSchema,
  orgName: optionalTrimmedText,
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Verification token is required."),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const resetPasswordRequestSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;

export const resetPasswordConfirmSchema = z.object({
  token: z.string().trim().min(1, "Reset token is required."),
  password: passwordSchema,
});

export type ResetPasswordConfirmInput = z.infer<typeof resetPasswordConfirmSchema>;
