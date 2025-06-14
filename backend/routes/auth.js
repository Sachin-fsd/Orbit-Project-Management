import express from 'express';
import dotenv from 'dotenv';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateRequest } from "zod-express-middleware";
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verifyEmailSchema } from '../libs/validate-schema.js';
import { loginUser, registerUser, resetPasswordReqquest, verifyEmail, verifyResetPasswordTokenAndResetPassword } from '../controllers/auth-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';


const router = express.Router();
dotenv.config();

router.post('/register', validateRequest({
    body: registerSchema
}),
    registerUser
);
router.post('/login', validateRequest({
    body: loginSchema
}),
    loginUser
);
router.post("/verify-email",
    validateRequest({
        body: verifyEmailSchema,
    }),
    verifyEmail
);

router.post("/reset-password-request",
    validateRequest({
        body: emailSchema,
    }),
    resetPasswordReqquest
)

router.post("/reset-password",
    validateRequest({
        body: resetPasswordSchema
    }),
    verifyResetPasswordTokenAndResetPassword
)

router.get("/validate", authMiddleware, (req, res) => {
    res.status(200).json({ message: "User is authenticated" })
})

export default router;