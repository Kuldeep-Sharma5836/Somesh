const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, phone });

  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.password || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};

const getMe = async (req, res) => {
  return res.json(req.user);
};

const loginWithGoogle = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Missing Google credential' });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: 'Google client ID is not configured' });
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    return res.status(400).json({ message: 'Google account email not available' });
  }

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      password: crypto.randomBytes(16).toString('hex'),
      avatar: payload.picture || '',
      provider: 'google',
      googleId: payload.sub || '',
    });
  } else if (payload.sub && user.googleId !== payload.sub) {
    user.googleId = payload.sub;
    user.provider = 'google';
    if (payload.picture) user.avatar = payload.picture;
    await user.save();
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};

module.exports = { registerUser, loginUser, loginAdmin, getMe, loginWithGoogle };
