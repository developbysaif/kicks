import express from 'express';
import {
  getDashboardStats,
  getCustomers,
  toggleBlockCustomer
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/customers', getCustomers);
router.put('/customers/:id/block', toggleBlockCustomer);

export default router;
