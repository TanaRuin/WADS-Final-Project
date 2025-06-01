const express = require('express');
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfileImage,
  register,
  login,
  refreshToken,
  logout,
  googleLogin,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');

const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadProfilePic');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected user routes
router.get('/getProfile', authenticate, getUserProfile);
router.put('/updateProfile', authenticate, updateUserProfile);
router.post('/change-password', authenticate, changePassword);
router.post('/profile-image', authenticate, upload.single('profileImage'), uploadProfileImage);

module.exports = router;
