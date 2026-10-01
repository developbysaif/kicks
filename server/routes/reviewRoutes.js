import express from 'express';
import {
  getProductReviews,
  createReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);

router.get('/admin', protect, admin, getAdminReviews);
router.put('/:id/status', protect, admin, updateReviewStatus);
router.delete('/:id', protect, admin, deleteReview);

export default router;
