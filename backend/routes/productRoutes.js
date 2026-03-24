import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, bulkAssignCategory } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, admin, createProduct);
router.put('/bulk', protect, admin, bulkAssignCategory);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;
