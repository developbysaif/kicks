import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, default: 'Punjab' },
  postalCode: { type: String, default: '54000' },
  country: { type: String, default: 'Pakistan' },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: { type: String, default: '', trim: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
    index: true
  },
  emailVerified: { type: Boolean, default: false, index: true },
  emailVerifiedAt: { type: Date, default: null },
  verificationCodeHash: { type: String, default: null },
  verificationCodeExpiresAt: { type: Date, default: null },
  verificationAttempts: { type: Number, default: 0 },
  verificationResendCount: { type: Number, default: 0 },
  verificationResendWindowStart: { type: Date, default: null },
  resetCodeHash: { type: String, default: null },
  resetCodeExpiresAt: { type: Date, default: null },
  resetAttempts: { type: Number, default: 0 },
  addresses: [addressSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Dual compatibility alias: 'name' mirrors 'fullName'
userSchema.virtual('name')
  .get(function () {
    return this.fullName;
  })
  .set(function (v) {
    this.fullName = v;
  });

// Compatibility virtual for 'password'
userSchema.virtual('password')
  .set(function (rawPassword) {
    this._rawPassword = rawPassword;
  });

userSchema.pre('validate', async function (next) {
  if (this._rawPassword && (!this.passwordHash || !this.passwordHash.startsWith('$2'))) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this._rawPassword, salt);
  }
  if (next) next();
});

userSchema.pre('save', async function (next) {
  if (this._rawPassword && (!this.passwordHash || !this.passwordHash.startsWith('$2'))) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this._rawPassword, salt);
  } else if (this.isModified('passwordHash') && !this.passwordHash.startsWith('$2a$') && !this.passwordHash.startsWith('$2b$')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  if (next) next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!enteredPassword || !this.passwordHash) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
