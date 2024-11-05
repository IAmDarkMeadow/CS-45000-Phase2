import express from 'express';
import multer from 'multer';
import { uploadPackage } from '../controllers/uploadController';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.single('file'), uploadPackage);

export default router;
 