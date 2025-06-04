const express = require('express');

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

const router = express.Router();

// /**
//  * @openapi
//  * tags:
//  *    - name: User
//  *      description: User and authentication related operations
//  */

// Auth routes

// /**
//  * @openapi
//  * /register:
//  *   post:
//  *     tags: 
//  *       - User
//  *     summary: Register a new user
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

// /**
//  * @openapi
//  * /login:
//  *   post:
//  *     tags: 
//  *        - User
//  *     summary: Login user
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
//  * @openapi
//  * /google-login:
//  *   post:
//  *     tags: 
//  *        - User
//  *     summary: Login or register user via Google OAuth
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
//  * @openapi
//  * /refresh-token:
//  *   post:
//  *     tags: 
//  *        - User
//  *     summary: Refresh access token using refresh token cookie
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
//  * @openapi
//  * /logout:
//  *   post:
//  *     tags: 
//  *        - User
//  *     summary: Logout user (clear refresh token cookie)
//  *     responses:
//  *       200:
//  *         description: Logout successful
//  */
router.post('/logout', logout);

// /**
//  * @openapi
//  * /forgot-password:
//  *   post:
//  *     tags: 
//  *        - User
//  *     summary: Request password reset email
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
//  * @openapi
//  * /reset-password/{token}:
//  *   get:
//  *     tags: 
//  *        - User
//  *     summary: Validate password reset token
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
//  * @openapi
//  * /reset-password/{token}:
//  *   post:
//  *     tags: 
//  *        - User
//  *     summary: Reset password using token
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
//  * @openapi
//  * /getProfile:
//  *   get:
//  *     summary: Get user profile
//  *     tags: 
//  *        - User
//  *     security:
//  *       - cookieAuth: []
//  *     responses:
//  *       200:
//  *         description: User profile retrieved successfully
//  *       401:
//  *         description: Unauthorized
//  */
router.get('/getProfile', authenticate, getUserProfile);

// /**
//  * @openapi
//  * /updateProfile:
//  *   put:
//  *     summary: Update user profile description
//  *     tags: 
//  *        - User
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

module.exports = router;



