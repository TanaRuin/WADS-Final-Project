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
  registeradmin,
  uploadProfilePicture
} = require('../controllers/userController');

const { authenticate } = require('../middleware/authMiddleware');

// Auth routes
// /**
//  * @swagger
//  * /register:
//  *   post:
//  *     summary: Register a new user
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - firstName
//  *               - lastName
//  *               - email
//  *               - username
//  *               - password
//  *             properties:
//  *               firstName:
//  *                 type: string
//  *               lastName:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               username:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: User registered successfully
//  *       400:
//  *         description: Email already in use
//  *       500:
//  *         description: Failed to register user
//  */
router.post('/register', register);

router.post('/register-admin', registeradmin);
// /**
//  * @swagger
//  * /login:
//  *   post:
//  *     summary: Login user
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - username
//  *               - password
//  *             properties:
//  *               username:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Login successful
//  *       400:
//  *         description: Invalid credentials
//  */
router.post('/login', login);


// /**
//  * @swagger
//  * tags:
//  *   name: Authentication
//  *   description: Authentication related endpoints
//  */

// /**
//  * @swagger
//  * /google-login:
//  *   post:
//  *     summary: Login or register user via Google OAuth
//  *     tags: [Authentication]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               code:
//  *                 type: string
//  *                 description: Google OAuth authorization code
//  *                 example: "4/0AX4XfWhX..."
//  *     responses:
//  *       200:
//  *         description: Successful login
//  *       400:
//  *         description: Bad request, missing code
//  *       500:
//  *         description: Internal server error
//  */
router.post('/google-login', googleLogin);

// /**
//  * @swagger
//  * /refresh-token:
//  *   post:
//  *     summary: Refresh access token using refresh token cookie
//  *     tags: [Authentication]
//  *     responses:
//  *       200:
//  *         description: New access token generated
//  *       401:
//  *         description: Refresh token not found
//  *       403:
//  *         description: Invalid refresh token
//  */
router.post('/refresh-token', refreshToken);

// /**
//  * @swagger
//  * /logout:
//  *   post:
//  *     summary: Logout user (clear refresh token cookie)
//  *     tags: [Authentication]
//  *     responses:
//  *       200:
//  *         description: Logout successful
//  */
router.post('/logout', logout);

// /**
//  * @swagger
//  * tags:
//  *   name: Password Reset
//  *   description: Password reset and recovery
//  */

// /**
//  * @swagger
//  * /forgot-password:
//  *   post:
//  *     summary: Request password reset email
//  *     tags: [Password Reset]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               identifier:
//  *                 type: string
//  *                 description: Email or username for password reset
//  *                 example: user@example.com
//  *     responses:
//  *       200:
//  *         description: Password reset email sent
//  *       404:
//  *         description: User not found
//  *       500:
//  *         description: Failed to send reset email
//  */
router.post('/forgot-password', forgotPassword);


// /**
//  * @swagger
//  * /reset-password/{token}:
//  *   get:
//  *     summary: Validate password reset token
//  *     tags: [Password Reset]
//  *     parameters:
//  *       - in: path
//  *         name: token
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Password reset token
//  *     responses:
//  *       200:
//  *         description: Token is valid
//  *       400:
//  *         description: Invalid or expired token
//  */
router.get('/reset-password/:token', checkResetToken);

// /**
//  * @swagger
//  * /reset-password/{token}:
//  *   post:
//  *     summary: Reset password using token
//  *     tags: [Password Reset]
//  *     parameters:
//  *       - in: path
//  *         name: token
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Password reset token
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               password:
//  *                 type: string
//  *                 description: New password
//  *                 example: "NewPass123!"
//  *     responses:
//  *       200:
//  *         description: Password reset successful
//  *       400:
//  *         description: Invalid or expired token
//  */
router.post('/reset-password/:token', resetPassword);

// /**
//  * @swagger
//  * tags:
//  *   name: User Profile
//  *   description: User profile management
//  */

// /**
//  * @swagger
//  * /getProfile:
//  *   get:
//  *     summary: Get user profile
//  *     tags: [User Profile]
//  *     security:
//  *       - cookieAuth: []
//  *     responses:
//  *       200:
//  *         description: User profile retrieved successfully
//  *       401:
//  *         description: Unauthorized
//  */
// router.get('/getProfile', authenticate, getUserProfile);

// /**
//  * @swagger
//  * /updateProfile:
//  *   put:
//  *     summary: Update user profile description
//  *     tags: [User Profile]
//  *     security:
//  *       - cookieAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               description:
//  *                 type: string
//  *                 example: "This is my new profile description."
//  *     responses:
//  *       200:
//  *         description: Profile updated successfully
//  *       401:
//  *         description: Unauthorized
//  */
router.put('/updateProfile', authenticate, updateUserProfile);

router.post('/uploadpfp', authenticate, uploadProfilePicture);


module.exports = router;





