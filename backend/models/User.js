
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  resetPasswordOTP: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  savedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  progress: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedCheckpoints: [{ type: mongoose.Schema.Types.ObjectId }]
  }],
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
