const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');

const computeTotals = (orderItems) => {
  const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 79;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const getRazorpayClient = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const getProductsMap = async (orderItems) => {
  const ids = [...new Set(orderItems.map((item) => item.product))];
  const products = await Product.find({ _id: { $in: ids } });
  return new Map(products.map((product) => [product._id.toString(), product]));
};

const ensureSizeInventory = async (orderItems, { decrement = false } = {}) => {
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

    if (decrement) {
      sizeEntry.qty -= item.qty;
      product.countInStock = product.sizes.reduce((acc, entry) => acc + entry.qty, 0);
      updates.push(product.save());
    }
  }

  if (decrement) {
    await Promise.all(updates);
  }

  return null;
};

const createRazorpayOrder = async (req, res) => {
  const { orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items found' });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ message: 'Razorpay keys are not configured' });
  }

  const stockError = await ensureSizeInventory(orderItems);
  if (stockError) {
    return res.status(stockError.status).json({ message: stockError.message });
  }

  const { totalPrice } = computeTotals(orderItems);
  const amount = Math.round(totalPrice * 100);

  const client = getRazorpayClient();
  const razorpayOrder = await client.orders.create({
    amount,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
  });

  res.json({
    keyId: process.env.RAZORPAY_KEY_ID,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
};

const verifyRazorpayPayment = async (req, res) => {
  const { orderItems, shippingAddress, payment } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items found' });
  }

  if (!payment?.razorpayOrderId || !payment?.razorpayPaymentId || !payment?.razorpaySignature) {
    return res.status(400).json({ message: 'Invalid payment details' });
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = payment;
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');

  if (expected !== razorpaySignature) {
    return res.status(400).json({ message: 'Payment verification failed' });
  }

  const stockError = await ensureSizeInventory(orderItems, { decrement: true });
  if (stockError) {
    return res.status(stockError.status).json({ message: stockError.message });
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = computeTotals(orderItems);

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: 'RAZORPAY',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: true,
    paidAt: new Date(),
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  res.status(201).json(order);
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
