const express = require('express');
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  register,
  login,
  refreshToken,
  logout,
  googleLogin,
  forgotPassword,
  resetPassword,
  checkResetToken,
} = require('../controllers/userController');

const { authenticate } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/reset-password/:token', checkResetToken);

// Protected user routes
router.get('/getProfile', authenticate, getUserProfile);
router.put('/updateProfile', authenticate, updateUserProfile);


module.exports = router;
