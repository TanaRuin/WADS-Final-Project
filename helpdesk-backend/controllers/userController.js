const  User  = require('../models/Users');  
const { verifyGoogleToken } = require('../utils/googleAuth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateTokens = require('../utils/generateToken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const sendEmail = require('../utils/sendMail');
const { getGoogleUserFromCode } = require('../utils/googleAuth');

const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    const googleUser = await getGoogleUserFromCode(code);

    // Check if user already exists by email or googleId
    let user = await User.findOne({ 
      $or: [
        { email: googleUser.email },
        { googleId: googleUser.googleId }
      ]
    });

    if (user) {
      // User exists, just login
      const tokens = generateTokens(user);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        success: true,
        accessToken: tokens.accessToken,
        userdata: {
          userId: user.userId,
          email: user.email,
          accessLevel: user.accessLevel,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    }

    const randomPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    user = new User({
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      email: googleUser.email,
      googleId: googleUser.googleId,
      username: googleUser.email,
      password: hashedPassword,
      profileImage: googleUser.profileImage,
      accessLevel: 'user'
    });

    await user.save();

    const tokens = generateTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      userdata: {
        userId: user.userId,
        email: user.email,
        accessLevel: user.accessLevel,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userId: uuidv4(),
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      accessLevel: 'user',
    });

    await newUser.save();

    //Send welcome email
    await sendEmail(
      email,
      'Welcome to Belantara Ticketing System',
      `Hello ${firstName},\n\nWelcome to the Belantara Ticketing System! We're glad to have you here.\n\nBest regards,\nBelantara Team`
    );

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Failed to register user', error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const tokens = generateTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      userdata: {
        userId: user.userId,
        email: user.email,
        accessLevel: user.accessLevel,
        firstName: user.firstName,
        lastName: user.lastName,
        accessLevel: user.accessLevel,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



const forgotPassword = async (req, res) => {
  try {
    // user enters email or username
    const { identifier } = req.body; 

    // Find user by email OR username
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }  
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate reset token (secure random string)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save reset token and expiry to user 
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    const message = `Hi ${user.firstName},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n\nThanks!`;
    
    await sendEmail(user.email, 'Password Reset Request', message);

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset email' });
  }
};

const checkResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    res.status(200).json({ success: true, message: 'Valid token' });
  } catch (error) {
    console.error('Check reset token error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; 
    const { password } = req.body;

    // Find user with matching reset token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash( password, salt);

    // Clear reset token and expiry
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};


const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'Refresh token not found' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;


    const user = await User.findOne({ userId }).select('firstName lastName email accessLevel description profileImage');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      userdata: user
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { description } = req.body; 

    // Find user by id
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (description !== undefined) {
      user.description = description;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      userdata: {
        description: user.description,
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
};





module.exports = {
  getUserProfile,
  updateUserProfile,
  register,
  login,
  refreshToken,
  checkResetToken,
  logout,
  googleLogin,
  forgotPassword,
  resetPassword,

};
