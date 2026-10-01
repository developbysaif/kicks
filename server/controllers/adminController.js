import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

// @desc Get dashboard stats (Admin)
// @route GET /api/admin/dashboard-stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const lowStockProducts = await Product.find({ stock: { $lte: 10 } }).select('name stock sku image price');

    const totalSalesAggregate = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$grandTotal' } } }
    ]);
    const totalSales = totalSalesAggregate.length > 0 ? totalSalesAggregate[0].totalSales : 0;

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    const topProducts = await Product.find()
      .sort({ numReviews: -1, rating: -1 })
      .limit(5);

    res.json({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get customer accounts list (Admin)
// @route GET /api/admin/customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Block/Unblock customer account (Admin)
// @route PUT /api/admin/customers/:id/block
export const toggleBlockCustomer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json({ message: `Customer ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
