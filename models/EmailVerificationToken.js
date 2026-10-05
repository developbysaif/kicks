import mongoose from 'mongoose';

const emailVerificationTokenSchema = new mongoose.Schema({
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
  tokenHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours TTL
  }
}, {
  timestamps: true
});

const EmailVerificationToken = mongoose.models.EmailVerificationToken ||
  mongoose.model('EmailVerificationToken', emailVerificationTokenSchema);

export default EmailVerificationToken;
