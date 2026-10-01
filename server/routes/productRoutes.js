import express from 'express';
import {
  getProducts,
  getProductByIdentifier,
  getSearchSuggestions,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/search/suggestions', getSearchSuggestions);

router.route('/:identifier')
  .get(getProductByIdentifier)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
