import { z } from "zod";


const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(5, 'Password must be at least 5 characters long')
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(5, 'Password must be at least 5 characters long')
});

const verifyEmailSchema = z.object({
    token: z.string().min(1,'Token is required')
});

const resetPasswordSchema = z.object({
    token: z.string().min(1,'Token is required'),
    newPassword: z.string().min(5, 'Password must be at least 5 characters long'),
    confirmPassword: z.string().min(5, 'Password must be at least 5 characters long')
});

const emailSchema = z.object({
    email: z.string().email('Invalid email address')
});

export {registerSchema, loginSchema, verifyEmailSchema, resetPasswordSchema, emailSchema};