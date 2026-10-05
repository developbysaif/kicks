import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'newsletterSubscribers'
});

const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);

export default NewsletterSubscriber;
