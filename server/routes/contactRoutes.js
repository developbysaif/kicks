import express from 'express';
import {
  submitContactForm,
  subscribeNewsletter,
  getContactMessages
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContactForm);
router.post('/newsletter', subscribeNewsletter);
router.get('/messages', protect, admin, getContactMessages);

export default router;
