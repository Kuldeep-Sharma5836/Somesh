const Order = require('../models/Order');
const { sendOrderStatusNotification } = require('../utils/notificationService');

const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod = 'COD' } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items found' });
  }

  const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 79;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.status = status || order.status;
  order.isDelivered = status === 'delivered' ? true : order.isDelivered;
  order.deliveredAt = status === 'delivered' ? new Date() : order.deliveredAt;

  const updated = await order.save();
  await sendOrderStatusNotification(updated, updated.user);
  res.json(updated);
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
