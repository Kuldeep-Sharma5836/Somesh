const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderStatusNotification } = require('../utils/notificationService');

const getProductsMap = async (orderItems) => {
  const ids = [...new Set(orderItems.map((item) => item.product))];
  const products = await Product.find({ _id: { $in: ids } });
  return new Map(products.map((product) => [product._id.toString(), product]));
};

const ensureSizeInventory = async (orderItems) => {
  const productsMap = await getProductsMap(orderItems);
  const updates = [];

  for (const item of orderItems) {
    if (!item.size) {
      return { status: 400, message: 'Size is required for all order items' };
    }

    const product = productsMap.get(item.product.toString());
    if (!product) {
      return { status: 404, message: 'Product not found' };
    }

    const sizeEntry = product.sizes?.find((entry) => entry.size === item.size);
    if (!sizeEntry) {
      return { status: 400, message: `Size ${item.size} is not available for ${product.name}` };
    }

    if (item.qty > sizeEntry.qty) {
      return { status: 400, message: `Only ${sizeEntry.qty} left for size ${item.size}` };
    }

    sizeEntry.qty -= item.qty;
    product.countInStock = product.sizes.reduce((acc, entry) => acc + entry.qty, 0);
    updates.push(product.save());
  }

  await Promise.all(updates);
  return null;
};

const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod = 'COD' } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items found' });
  }

  const stockError = await ensureSizeInventory(orderItems);
  if (stockError) {
    return res.status(stockError.status).json({ message: stockError.message });
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
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
  res.json(orders);
};

const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  await order.deleteOne();
  res.json({ message: 'Order deleted' });
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
  deleteOrder,
};
