import express from 'express';
import Course from '../models/Course.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
const router = express.Router();


// Create course (admin only)
router.post('/create', auth, admin, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/courses/:courseId/resources - Add a new resource to a course
router.post('/:courseId/resources', auth, async (req, res) => {
  const { title, url, description, tags } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }

  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newResource = {
      title,
      url,
      description,
      tags,
      user: req.user // user ID from auth middleware
    };

    course.resources.push(newResource);
    await course.save();

    res.status(201).json({ message: 'Resource added successfully', resource: newResource });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
