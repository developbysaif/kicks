import express from 'express';
import {
  applyCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', applyCoupon);

router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.delete('/:id', protect, admin, deleteCoupon);

export default router;
