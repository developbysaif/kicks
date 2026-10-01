import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc Get reviews for a product
// @route GET /api/reviews/product/:productId
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a review (Authenticated user)
// @route POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, image } = req.body;

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      image: image || '',
      isApproved: true
    });

    // Update product rating and numReviews
    const reviews = await Review.find({ product: productId, isApproved: true });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(avgRating.toFixed(1)),
      numReviews: reviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all reviews for admin
// @route GET /api/reviews/admin
export const getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name images slug')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve/Reject review (Admin)
// @route PUT /api/reviews/:id/status
export const updateReviewStatus = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findById(req.params.id);
    if (review) {
      review.isApproved = isApproved;
      await review.save();

      // Recalculate product rating
      const reviews = await Review.find({ product: review.product, isApproved: true });
      const avgRating = reviews.length > 0 ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length) : 5.0;

      await Product.findByIdAndUpdate(review.product, {
        rating: parseFloat(avgRating.toFixed(1)),
        numReviews: reviews.length
      });

      res.json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete review (Admin)
// @route DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      const productId = review.product;
      await review.deleteOne();

      // Recalculate product rating
      const reviews = await Review.find({ product: productId, isApproved: true });
      const avgRating = reviews.length > 0 ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length) : 5.0;

      await Product.findByIdAndUpdate(productId, {
        rating: parseFloat(avgRating.toFixed(1)),
        numReviews: reviews.length
      });

      res.json({ message: 'Review deleted' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
