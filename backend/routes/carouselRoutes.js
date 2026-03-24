import express from 'express';
import { getCarousels, createCarousel, updateCarousel, deleteCarousel, reorderCarousels } from '../controllers/carouselController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCarousels);
router.post('/', protect, admin, createCarousel);
router.put('/reorder', protect, admin, reorderCarousels);
router.route('/:id').put(protect, admin, updateCarousel).delete(protect, admin, deleteCarousel);

export default router;
