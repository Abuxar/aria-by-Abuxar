import Order from '../models/Order.js';
import Product from '../models/Product.js';
import crypto from 'crypto';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest) or Private (User)
export const addOrderItems = async (req, res) => {
  try {
    const { 
       orderItems, 
       shippingAddress, 
       paymentMethod, 
       itemsPrice, 
       taxPrice, 
       shippingPrice, 
       totalPrice 
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items mapped in request body' });
    }

    // Generate a secure, unique, human-readable 8-char hex tracking ID
    const trackingId = crypto.randomBytes(4).toString('hex').toUpperCase();

    const order = new Order({
      orderItems,
      user: req.user ? req.user._id : undefined,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      trackingId,
      isPaid: true, // Auto-paid flag active for dummy simulation bridge
      paidAt: Date.now(),
      paymentResult: {
        id: `mock_tx_${crypto.randomBytes(8).toString('hex')}`,
        status: 'completed',
        update_time: new Date().toISOString()
      }
    });

    const createdOrder = await order.save();

    // Decrement stock universally for each item
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = product.stock - item.quantity;
        if(product.stock < 0) product.stock = 0;
        await product.save();
      }
    }

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error(`Error creating order mutation: ${error.message} - Stack: ${error.stack}`);
    res.status(500).json({ message: `Core server fault: ${error.message}` });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order structure untraceable' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal fetching fault on order tracking endpoint' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Fault querying user-specific localized order grid' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Fault parsing broad orders for administrator context' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order structure untraceable' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server fault securely mapping delivery timestamp boolean constraints' });
  }
};

// @desc    Update order to dispatched
// @route   PUT /api/orders/:id/dispatch
// @access  Private/Admin
export const updateOrderToDispatched = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDispatched = true;
      order.dispatchedAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order structure untraceable' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server fault securely mapping dispatch timestamp boolean constraints' });
  }
};
