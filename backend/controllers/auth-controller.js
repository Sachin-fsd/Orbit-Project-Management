import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Verification from '../models/verification.model.js';
import { sendEmail } from '../libs/send-email.js';
import aj from '../libs/arcjet.js';

const registerUser = async (req, res) => {

    try {
        // Extract user data from request body
        const { name, email, password } = req.body;

        const decision = await aj.protect(req, { email }); // Deduct 5 tokens from the bucket
        console.log("Arcjet decision", decision.conclusion);

        if (decision.isDenied()) {
            console.log("Arcjet denied request", email)
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid email address" }));
            return;
        }

        console.log('Registering user:', { name, email });
        // existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const verificationToken = jwt.sign(
            { userId: newUser._id, purpose: 'emailVerification' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        await Verification.create({
            userId: newUser._id,
            token: verificationToken,
            expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
        });

        // send twilio email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailBody = `
        <h1>Welcome to Orbit, 
        ${newUser.name}!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <button><a href="${verificationLink}">Verify Email</a></button>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Thank you for joining us!</p>
        `;
        const emailSubject = 'Email Verification - Welcome to Orbit';

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);
        if (!isEmailSent) {
            return res.status(500).json({ message: 'Failed to send verification email' });
        }

        console.log('User registered successfully, verify the email', newUser);
        res.status(201).json({ message: 'User registered successfully, verify the email', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const loginUser = async (req, res) => {
    try {
        // Extract user credentials from request body
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isEmailVerified) {
            const existingVerification = await Verification.findOne({ userId: user._id });

            if (existingVerification && existingVerification.expiresAt > new Date(Date.now())) {
                return res.status(400).json({ message: 'Email not verified' });
            } else {
                await Verification.findByIdAndDelete(existingVerification._id);

                const verificationToken = jwt.sign({ userId: user._id, purpose: 'emailVerification' }, process.env.JWT_SECRET, { expiresIn: '1h' })

                await Verification.create({
                    userId: user._id,
                    token: verificationToken,
                    expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
                })

                // send twilio email
                const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
                const emailBody = `
                <h1>Welcome to Orbit, 
                ${newUser.name}!</h1>
                <p>Please verify your email by clicking the link below:</p>
                <button><a href="${verificationLink}">Verify Email</a></button>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Thank you for joining us!</p>
                `;
                const emailSubject = 'Email Verification - Welcome to Orbit';

                const isEmailSent = await sendEmail(email, emailSubject, emailBody);
                if (!isEmailSent) {
                    return res.status(500).json({ message: 'Failed to send verification email' });
                }
                res.status(201).json({ message: 'Please verify the email', user: newUser });
            }
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        user.lastLogin = new Date();
        await user.save();

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({ message: 'Login successful', token, user: userData });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const verifyEmail = async (req, res) => {
    try {
        // Extract token from URL query
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }
        // Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const { userId, purpose } = payload;
        if (purpose !== 'emailVerification') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const verification = await Verification.findOne({ userId, token });

        if (!verification || verification.expiresAt < new Date()) {
            return res.status(403).json({ message: 'Token expired' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "Unauthorized" })
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email already verified" })
        }

        user.isEmailVerified = true;
        await user.save();

        await Verification.findByIdAndDelete(verification._id);
        res.status(200).json({ message: 'Email verified successfully' });
    }
    catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const resetPasswordReqquest = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ message: 'Email not verified' });
        }

        const existingVerification = await Verification.findOne({ userId: user._id });
        if (existingVerification && existingVerification.expiresAt > new Date(Date.now())) {
            return res.status(400).json({ message: 'Password reset request already sent' });
        }

        if (existingVerification && existingVerification.expiresAt < new Date(Date.now())) {
            await Verification.findByIdAndDelete(existingVerification._id);
        }

        const resetPasswordToken = jwt.sign({ userId: user._id, purpose: 'resetPassword' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await Verification.create({
            userId: user._id,
            token: resetPasswordToken,
            expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
        });

        // send twilio email
        const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
        const emailBody = `
        <h1>Password Reset Request</h1>
        <p>Please click the link below to reset your password:</p>
        <button><a href="${resetPasswordLink}">Reset Password</a></button>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you for using Orbit!</p>
        `;
        const emailSubject = 'Password Reset Request - Orbit';

        const isEmailSent = await sendEmail(user.email, emailSubject, emailBody);
        if (!isEmailSent) {
            return res.status(500).json({ message: 'Failed to send email' });
        }

        res.status(200).json({ message: 'Password reset request sent' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
    try {
        // Extract token from URL query
        const { token, newPassword, confirmPassword } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }
        // Verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const { userId, purpose } = payload;
        if (purpose !== 'resetPassword') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const verification = await Verification.findOne({ userId, token });

        if (!verification || verification.expiresAt < new Date()) {
            return res.status(403).json({ message: 'Token expired' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "Unauthorized" })
        }

        if(newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await Verification.findByIdAndDelete(verification._id);
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { registerUser, loginUser, verifyEmail, resetPasswordReqquest, verifyResetPasswordTokenAndResetPassword };