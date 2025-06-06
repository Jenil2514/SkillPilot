import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import validator from 'validator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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
  if (!/^[A-Za-z0-9\s]+$/.test(trimmedName)) {
    return res.status(400).json({ message: "Name can only contain letters, numbers, and spaces" });
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
    const newUser = new User({ name: trimmedName, email, password: hashedPassword });
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
  // Password strength check is not required on login, only on registration/reset
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
  const { userId } = req.params;
  if (!validator.isMongoId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try {
    const user = await User.findById(userId).select('-password');
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
      profession: user.profession || '',
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

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  if (!validator.isMongoId(req.user)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio || '',
      location: user.location || '',
      profession: user.profession || '',
      avatar: user.avatar || '',
      role: user.role || 'user',
      joinDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Unknown',
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
    const { name, bio, location, profession, email } = req.body;
    // Validate input
    if (name && !validator.isLength(name.trim(), { min: 2, max: 50 })) {
      return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }
    if (name && !/^[A-Za-z0-9\s]+$/.test(name.trim())) {
      return res.status(400).json({ message: "Name can only contain letters, numbers, and spaces" });
    }
    if (bio && !validator.isLength(bio, { max: 500 })) {
      return res.status(400).json({ message: 'Bio must be 500 characters or less' });
    }
    if (location && !validator.isLength(location, { max: 100 })) {
      return res.status(400).json({ message: 'Location must be 100 characters or less' });
    }
    if (profession && !validator.isLength(profession, { max: 100 })) {
      return res.status(400).json({ message: 'Profession must be 100 characters or less' });
    }
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      // Check if email is already used by another user
      const existingUser = await User.findOne({ email, _id: { $ne: req.user } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (profession !== undefined) updateData.profession = profession;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(req.user, updateData, { new: true }).select('-password');
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

    // Send email with OTP
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your email password or app password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);

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
  if (!validator.isLength(name.trim(), { min: 2, max: 50 })) {
    return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!validator.isLength(subject, { min: 2, max: 100 })) {
    return res.status(400).json({ message: 'Subject must be between 2 and 100 characters' });
  }
  if (!validator.isLength(message, { min: 5, max: 1000 })) {
    return res.status(400).json({ message: 'Message must be between 5 and 1000 characters' });
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
  const { courseId } = req.params;
  if (!validator.isMongoId(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
  const { courseId } = req.params;
  if (!validator.isMongoId(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.savedCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's course progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('progress.course');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.progress || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update progress for a course
router.put('/progress/:courseId', auth, async (req, res) => {
  const { courseId } = req.params;
  const { completedCheckpoints } = req.body;

  if (!Array.isArray(completedCheckpoints)) {
    return res.status(400).json({ message: 'completedCheckpoints must be an array' });
  }

  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const progressItem = user.progress.find(
      (item) => item.course.toString() === courseId
    );

    if (progressItem) {
      progressItem.completedCheckpoints = completedCheckpoints;
    } else {
      user.progress.push({ course: courseId, completedCheckpoints });
    }

    await user.save();
    res.json({ message: 'Progress updated', progress: user.progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get only the user's name by userId (public)
router.get('/name/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
