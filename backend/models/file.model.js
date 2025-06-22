// models/File.js
import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    s3Url: { // This will store the URL of the file in S3 or other cloud storage
        type: String,
        required: true
    },
    userId: { // To associate files with a specific user
        type: String, // Assuming userId is a string, e.g., from a JWT or session
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps:true
});

const File = mongoose.model('File', fileSchema);
export default File;