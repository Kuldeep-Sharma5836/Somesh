const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

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

const createRazorpayOrder = async (req, res) => {
  const { orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items found' });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ message: 'Razorpay keys are not configured' });
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
