const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true, 
    select: false 
  },
  role: { 
    type: String, 
    default: 'USER' // ya 'user' 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACTIVE', 'REJECTED', 'DEACTIVATED'], 
    default: 'PENDING' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;