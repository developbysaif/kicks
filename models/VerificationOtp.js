import mongoose from 'mongoose';

const verificationOtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  purpose: {
    type: String,
    enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'LOGIN_VERIFICATION', 'ADMIN_EMAIL_VERIFICATION'],
    default: 'EMAIL_VERIFICATION',
    required: true,
    index: true
  },
  otpHash: {
    type: String,
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  isUsed: {
    type: Boolean,
    default: false,
    index: true
  },
  usedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Automatically delete 1 hour after creation
  }
}, {
  timestamps: true
});

// Composite indexes for fast queries
verificationOtpSchema.index({ email: 1, purpose: 1, isUsed: 1 });
verificationOtpSchema.index({ userId: 1, purpose: 1, isUsed: 1 });

const VerificationOtp = mongoose.models.VerificationOtp ||
  mongoose.model('VerificationOtp', verificationOtpSchema);

export default VerificationOtp;
