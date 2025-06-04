
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import validator from 'validator';
import crypto from 'crypto';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const trimmedName = name?.trim();

  if (!trimmedName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!validator.isLength(trimmedName, { min: 2, max: 50 })) {
    return res.status(400).json({
      message: 'Name must be between 2 and 50 characters',
    });
  }
  if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
    return res.status(400).json({
      message: 'Name can only contain letters and spaces',
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol',
    });
  }
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol',
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile by ID (public view)
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return public profile data
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown',
      stats: {
        coursesCompleted: user.progress ? user.progress.length : 0,
        hoursLearned: Math.floor(Math.random() * 200) + 50, // Mock data
        certificates: Math.floor(Math.random() * 15) + 3, // Mock data
        currentStreak: Math.floor(Math.random() * 30) + 1 // Mock data
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      name: user.name,
      email: user.email,
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown',
      stats: {
        coursesCompleted: user.progress ? user.progress.length : 0,
        hoursLearned: Math.floor(Math.random() * 200) + 50,
        certificates: Math.floor(Math.random() * 15) + 3,
        currentStreak: Math.floor(Math.random() * 30) + 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, location, website } = req.body;
    
    // Validate input
    if (name && !validator.isLength(name.trim(), { min: 2, max: 50 })) {
      return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }
    
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot password - send OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = otpExpires;
    await user.save();
    
    // In production, send email with OTP
    console.log(`OTP for ${email}: ${otp}`);
    
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  if (!validator.isStrongPassword(newPassword)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol',
    });
  }
  
  try {
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact us
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  try {
    // In production, save to database or send email
    console.log('Contact form submission:', { name, email, subject, message });
    
    res.json({ message: 'Your message has been sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save/star a course
router.post('/save/:courseId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const courseId = req.params.courseId;

    if (user.savedCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Course already saved' });
    }

    user.savedCourses.push(courseId);
    await user.save();

    res.json({ message: 'Course saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove/unstar a saved course
router.delete('/unsave/:courseId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const courseId = req.params.courseId;

    user.savedCourses = user.savedCourses.filter(id => id.toString() !== courseId);
    await user.save();

    res.json({ message: 'Course removed from saved list' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get saved courses
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('savedCourses');
    res.json(user.savedCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
