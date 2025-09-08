import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(100, "First name must be at most 100 characters long"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(100, "Last name must be at most 100 characters long"),
    email: z.email("Email must be a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(255, "Password must be at most 255 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters long")
      .max(255, "Confirm password must be at most 255 characters long"),
    acceptPrivacyAndTerms: z.boolean().refine((value) => value, {
      message: "You must accept the privacy policy and terms",
    }),
    acceptMarketing: z.boolean().refine((value) => value, {
      message: "You must accept the marketing terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
