import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import validator from 'validator';


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
