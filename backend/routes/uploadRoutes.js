import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    // Upload standard file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'aria_products',
    });
    
    // Clean up local temp file synchronously
    fs.unlinkSync(req.file.path);
    
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

export default router;
