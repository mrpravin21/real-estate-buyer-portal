import { z } from "zod";

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128);

const avatarDataUrl = z
  .string()
  .min(50, "Please upload a profile photo")
  .max(1_200_000, "Image is too large — try a smaller photo")
  .regex(
    /^data:image\/(jpeg|jpg|png|webp);base64,/i,
    "Use a JPG, PNG, or WebP image"
  );

export const registerSchema = z
  .object({
    email: z.string().trim().email("Invalid email").max(255),
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirm your password"),
    name: z.string().trim().min(1, "Name is required").max(255),
    avatarDataUrl: avatarDataUrl,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Password is required").max(128),
});
