// routes/universityRoutes.js
import express from 'express';
import University from '../models/University.js';
import Semester from '../models/Semester.js';
import Course from '../models/Course.js';
import admin from '../middleware/admin.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a University
router.post('/createUniversity',auth,admin, async (req, res) => {
  const { name } = req.body;

  try {
    const university = new University({ name });
    await university.save();
    res.status(201).json(university);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Universities with Semesters and Courses (nested populate)
router.get('/', async (req, res) => {
  try {
    const universities = await University.find()
      .populate({
        path: 'semesters',
        populate: { path: 'courses' }
      });
    res.json(universities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Semester to University
router.post('/:universityId/semesters',auth,admin, async (req, res) => {
  const { universityId } = req.params;
  const { number } = req.body;

  try {
    const semester = new Semester({ number });
    await semester.save();

    const university = await University.findById(universityId);
    if (!university) return res.status(404).json({ message: 'University not found' });

    university.semesters.push(semester._id);
    await university.save();

    res.status(201).json(semester);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Course to Semester admin
router.post('/semester/:semesterId/courses',auth,admin, async (req, res) => {
  const { semesterId } = req.params;
  const { name, image, description,resources } = req.body;

  try {
    const course = new Course({ name, image, description,resources });
    await course.save();

    const semester = await Semester.findById(semesterId);
    if (!semester) return res.status(404).json({ message: 'Semester not found' });

    semester.courses.push(course._id);
    await semester.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single University with nested data
router.get('/:universityId', async (req, res) => {
  try {
    const university = await University.findById(req.params.universityId)
      .populate({
        path: 'semesters',
        populate: { path: 'courses' }
      });
    if (!university) return res.status(404).json({ message: 'University not found' });

    res.json(university);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
