import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, addSubcategory, deleteSubcategory } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route('/:id')
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

router.post('/:id/subcategories', protect, admin, addSubcategory);
router.delete('/:id/subcategories/:subId', protect, admin, deleteSubcategory);

export default router;
