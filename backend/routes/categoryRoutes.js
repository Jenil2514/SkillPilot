// routes/categoryRoutes.js
import express from 'express';
import Category from '../models/Category.js';
import University from '../models/University.js';
import Course from '../models/Course.js';

const router = express.Router();

// Create a new category
router.post('/', async (req, res) => {
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
      .populate('universities')
      .populate('courses');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a university to a category (only if type is 'university')
router.post('/:categoryId/universities', async (req, res) => {
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
router.post('/:categoryId/courses', async (req, res) => {
  const { name, image, description } = req.body;
  const { categoryId } = req.params;

  try {
    const course = new Course({ name, image, description });
    await course.save();

    const category = await Category.findById(categoryId);
    if (category.type !== 'general') {
      return res.status(400).json({ message: 'This category does not accept direct courses' });
    }

    category.courses.push(course._id);
    await category.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
