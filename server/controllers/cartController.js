import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc Get user cart
// @route GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add item to cart
// @route POST /api/cart
export const addToCart = async (req, res) => {
  try {
    const { productId, variation, quantity, price } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.variation === (variation || '')
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += (Number(quantity) || 1);
    } else {
      cart.items.push({
        product: productId,
        variation: variation || '',
        quantity: Number(quantity) || 1,
        price: price || (product.salePrice > 0 ? product.salePrice : product.price)
      });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update cart item quantity
// @route PUT /api/cart/:itemId
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const item = cart.items.id(req.params.itemId);
      if (item) {
        item.quantity = Number(quantity);
        if (item.quantity <= 0) {
          cart.items.pull(req.params.itemId);
        }
        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate('items.product');
        return res.json(updatedCart);
      }
    }
    res.status(404).json({ message: 'Cart item not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('items.product');
      return res.json(updatedCart);
    }
    res.status(404).json({ message: 'Cart not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Clear cart
// @route DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.appliedCoupon = '';
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
