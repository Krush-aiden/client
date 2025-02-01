import { z } from "zod";

// User Signup Schema Validation
export const userSignupSchema = z.object({
    fullName: z.string().min(1, "Full name is required."),
    contact: z.string()
    .min(10, "Contact number must be exactly 10 digits.")
    .regex(/^\d+$/, "Contact number must contain only digits."),
    email: z.string().email("The email address provided is invalid."),
    password: z.string().min(6, "Password must contain at least 6 characters."),
});

export type SignupInputState = z.infer<typeof userSignupSchema>;

// User Login Schema Validation
export const userLoginSchema = z.object({
    email: z.string().email("The email address provided is invalid."),
    password: z.string().min(6, "Password must contain at least 6 characters."),
});

export type LoginInputState = z.infer<typeof userLoginSchema>;

//User Forget-Password Schema Validation
export const forgetPasswordSchema = z.object({
    email: z.string().email("The email address provided is invalid."),
});

export type userForgetPassword = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, "Password must contain at least 6 characters."),
});

export type userResetPassword = z.infer<typeof resetPasswordSchema>;