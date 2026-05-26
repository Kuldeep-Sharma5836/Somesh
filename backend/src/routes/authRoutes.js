const express = require('express');
const {
	loginUser,
	loginAdmin,
	registerUser,
	getMe,
	loginWithGoogle,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', loginWithGoogle);
router.post('/admin/login', loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;
