import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import streamifier from 'streamifier';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              { folder: 'aria_products' },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    const result = await streamUpload(req);
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed. Check API keys and network.', error: error.message || error });
  }
});

export default router;
