import ContactMessage from '../models/ContactMessage.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// @desc Submit contact form
// @route POST /api/contact
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const contactMsg = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });

    res.status(201).json({ message: 'Thank you for reaching out! We will contact you soon.', data: contactMsg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Subscribe to newsletter
// @route POST /api/newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide a valid email' });

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.json({ message: 'You are already subscribed to our newsletter!' });
    }

    await NewsletterSubscriber.create({ email });
    res.status(201).json({ message: 'Subscribed successfully! Thank you for joining Kick Home Care.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get contact messages (Admin)
// @route GET /api/contact/messages
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
