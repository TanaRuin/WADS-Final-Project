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
  googleId: {  
    type: String,
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


}, {
  timestamps: true 
});



const User = mongoose.model('User', userSchema);

module.exports = User;
