import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { deleteFile, getFiles, uploadFile } from "../controllers/file.js";
import multer from 'multer'

const router = express.Router();

const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage: storage });

router.post("/upload", authMiddleware, upload.single('pdfFile'), uploadFile);
router.get(
    "/",
    authMiddleware,
    getFiles
);
router.delete("/:id", authMiddleware, deleteFile)

export default router;
