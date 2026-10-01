import express from 'express';
import {
  getCategories,
  getCategoryByIdentifier,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route('/:identifier')
  .get(getCategoryByIdentifier)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;
