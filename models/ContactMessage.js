import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  phone: { type: String, default: '', trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new',
    index: true
  }
}, {
  timestamps: true,
  collection: 'contactMessages',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-lowercase status setter for compatibility
contactMessageSchema.path('status').set(function (val) {
  return val ? val.toLowerCase() : 'new';
});

const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
