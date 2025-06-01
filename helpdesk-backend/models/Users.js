const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    sparse: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
  
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  accessLevel: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin'] 
  },
  jobRole: {
    type: String,
    default: null,
    trim: true
  },
  description: {
    type: String,
    default: null,
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  },
  resetPasswordToken: { 
    type: String 
  },
  resetPasswordExpires: { 
    type: Date 
  },
  // Add fields to track OAuth users
  isOAuthUser: {
    type: Boolean,
    default: false
  },
  oauthProvider: {
    type: String,
    enum: ['google'],
    default: null
  }
}, {
  timestamps: true 
});



const User = mongoose.model('User', userSchema);

module.exports = User;
