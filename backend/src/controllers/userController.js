const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = req.body.name || user.name;
  user.avatar = req.body.avatar || user.avatar;
  user.phone = req.body.phone ?? user.phone;

  if (req.body.password) {
    user.password = req.body.password;
  }

  if (Array.isArray(req.body.addresses)) {
    user.addresses = req.body.addresses;
  }

  const updated = await user.save();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    avatar: updated.avatar,
    phone: updated.phone,
    addresses: updated.addresses,
  });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (req.user._id.toString() === user._id.toString()) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }

  if (user.role === 'admin') {
    return res.status(400).json({ message: 'Admin accounts cannot be deleted' });
  }

  await user.deleteOne();
  res.json({ message: 'User removed' });
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
};
