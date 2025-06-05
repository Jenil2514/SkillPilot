// routes/categoryRoutes.js
import express from 'express';
import Category from '../models/Category.js';
import University from '../models/University.js';
import Course from '../models/Course.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import validator from 'validator';

const router = express.Router();

// Create a new category
router.post('/createcategory', auth, admin, async (req, res) => {
  const { name, type } = req.body;

  try {
    const category = new Category({ name, type });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .populate({
        path: 'universities',
        model: 'University',
        
      })
      .populate('courses'); // for 'general' categories if needed

    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a university to a category (only if type is 'university')
router.post('/:categoryId/universities', auth, admin, async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  try {
    const university = new University({ name });
    await university.save();

    const category = await Category.findById(categoryId);
    if (category.type !== 'university') {
      return res.status(400).json({ message: 'This category does not accept universities' });
    }

    category.universities.push(university._id);
    await category.save();

    res.status(201).json(university);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a course to a general category
router.post('/:categoryId/courses', auth, async (req, res) => {
  let { name, image, description } = req.body;
  const { categoryId } = req.params;

  // Validate required fields
  if (!name || typeof name !== 'string' || validator.isEmpty(name.trim())) {
    return res.status(400).json({ message: 'Course name is required' });
  }
  // Optionally validate image URL if provided
  if (image && !validator.isURL(image, { require_protocol: true })) {
    return res.status(400).json({ message: 'Invalid image URL format' });
  }

  // Sanitize fields
  name = validator.escape(name);
  if (description) description = validator.escape(description);

  try {
    const course = new Course({ name, image, description });
    await course.save();

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.type !== 'general') {
      return res.status(400).json({ message: 'This category does not accept direct courses' });
    }

    // Ensure courses is initialized
    if (!category.courses) category.courses = [];

    category.courses.push(course._id);
    await category.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
