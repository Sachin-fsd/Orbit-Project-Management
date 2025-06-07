import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false // Do not return password in queries
    },
    profilePicture: {
        type: String,
        default: 'https://img.icons8.com/?size=50&id=98957&format=png&color=000000' // Default profile picture URL
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    },
    is2FAEnabled: {
        type: Boolean,
        default: false
    },
    twoFAOtp: {
        type: String,
        default: null,
        select: false // Do not return OTP in queries
    },
    twoFAOtpExpires: {
        type: Date,
        default: null
    }
}, { timestamps: true } // Automatically manage createdAt and updatedAt fields});
);  


const User = mongoose.model('User', userSchema);
export default User;