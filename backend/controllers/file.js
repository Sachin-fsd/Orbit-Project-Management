import File from "../models/file.model.js";
import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config();


export const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const { userId } = req.user
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        console.log(req.file)
        AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region:  "ap-south-1"
        });
        const s3 = new AWS.S3();
        const uploadResult = await s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${Date.now()}-${req.file.originalname}`, // Use a unique key for S3
            Body: req.file.buffer, // Pass the file content (Buffer) directly
            ContentType: req.file.mimetype // Essential for S3 to serve the file correctly
        }).promise();
        console.log('File uploaded to S3:', uploadResult);
        const s3Url = uploadResult.Location;
        // --- End S3 Integration ---

        const newFile = new File({
            fileName: req.file.originalname,
            s3Url: s3Url, // Store the URL where the file is accessible
            userId: userId,
        });

        await newFile.save();
        console.log('File metadata saved:', newFile);

        res.status(201).json({
            message: 'File uploaded and metadata saved successfully',
            file: newFile
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Server error during file upload.', error: error.message });
    }
}; 

export const getFiles = async (req, res) => {
    const { userId } = req.user
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const files = await File.find({ userId: userId }).sort({ createdAt: -1 });
        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Server error during file upload.', error: error.message });
    }
}

// Controller function to delete a file from S3 and its record from the database
export const deleteFile = async (req, res) => {
    const { id } = req.params; // Get file ID from URL parameters
    const { userId } = req.user; // Get userId from authenticated user

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    try {
        // 1. Find the file in the database
        const fileToDelete = await File.findOne({ _id: id, userId: userId });

        if (!fileToDelete) {
            return res.status(404).json({ message: 'File not found or you do not have permission to delete it.' });
        }

        // Extract the S3 Key from the s3Url
        // https://conference-photos-sachin.s3.ap-south-1.amazonaws.com/1750564467259-Sachin%20%20%20_INTERNSHIP_1746416864681834e0e35d8_offer_letter.pdf
        // Assuming your S3 URL structure is like: https://<bucket-name>.s3.<region>.amazonaws.com/user-uploads/<userId>/<timestamp>-<filename>
        const urlParts = fileToDelete.s3Url.split('/');
        // The S3 Key starts after the bucket name (index 2 after protocol and domain parts)
        // If the URL is just 'https://bucket.s3.region.amazonaws.com/key', then split gives ['', 'https:', '', 'bucket.s3.region.amazonaws.com', 'key']
        // We need 'user-uploads/userId/timestamp-filename'
        // A more robust way might be to store the S3 Key directly in the database.
        // For now, let's assume the Key is everything after the bucket name in the path.
        const s3Key = urlParts.slice(3).join('/'); // Adjust index if your URL structure differs

        if (!s3Key) {
            console.error("Could not extract S3 Key from URL:", fileToDelete.s3Url);
            return res.status(500).json({ message: 'Could not determine S3 key for deletion.' });
        }

        // 2. Delete the file from S3
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key
        };
        const s3 = new AWS.S3();

        await s3.deleteObject(deleteParams).promise();
        console.log('File deleted from S3:', s3Key);

        // 3. Delete the file record from the database
        await File.deleteOne({ _id: id });
        console.log('File metadata deleted from DB for ID:', id);

        res.status(200).json({ message: 'File deleted successfully.' });

    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Server error during file deletion.', error: error.message });
    }
};
