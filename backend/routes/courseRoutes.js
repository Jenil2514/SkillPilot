import express from 'express';
import Course from '../models/Course.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import validator from 'validator';

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

// Get a single course by ID
router.get('/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/courses/:courseId/resources - Add a new resource to a course
router.post('/:courseId/resources', auth, async (req, res) => {
  let { title, url, description, tags, type } = req.body;

  // Validate required fields
  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }

  // Validate URL
  if (!validator.isURL(url, { require_protocol: true })) {
    return res.status(400).json({ message: 'Invalid URL format' });
  }

  // Sanitize title and description
  title = validator.escape(title);
  if (description) description = validator.escape(description);

  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newResource = {
      title,
      url,
      description,
      tags,
      type: type || 'other', // default to 'other' if not provided
      AddedBy: req.user // user ID from auth middleware
    };

    course.resources.push(newResource);
    await course.save();

    res.status(201).json({ message: 'Resource added successfully', resource: newResource });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upvote a resource in a course
router.post('/:courseId/resources/:resourceId/upvote', auth, async (req, res) => {
  try {
    const { courseId, resourceId } = req.params;
    const userId = req.user;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const resource = course.resources.id(resourceId);
        // console.log("before",resource.upvotes);

    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    // Check if user already upvoted
    if (resource.upvotedBy && resource.upvotedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already upvoted this resource.' });
    }

    resource.upvotes = (resource.upvotes || 0) + 1;
    resource.upvotedBy = resource.upvotedBy || [];
    resource.upvotedBy.push(userId);
    await course.save();
    // console.log("after add",resource.upvotes);

    res.json({ message: 'Resource upvoted', upvotes: resource.upvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove upvote from a resource in a course
router.post('/:courseId/resources/:resourceId/remove-upvote', auth, async (req, res) => {
  try {
    const { courseId, resourceId } = req.params;
    const userId = req.user;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const resource = course.resources.id(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    // console.log("before",resource.upvotes);
    // Check if user has upvoted
    if (!resource.upvotedBy || !resource.upvotedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have not upvoted this resource.' });
    }

    // Remove user from upvotedBy and decrement upvotes
    resource.upvotedBy = (resource.upvotedBy || []).filter(
      id => id && id.toString() !== userId.toString()
    );
    resource.upvotes = Math.max((resource.upvotes || 1) - 1, 0);
    await course.save();
    // console.log("after remove",resource.upvotes);

    res.json({ message: 'Upvote removed', upvotes: resource.upvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a checkpoint to a course (admin only)
router.post('/:courseId/checkpoints', auth, admin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, resources } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Checkpoint title is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newCheckpoint = {
      title,
      resources: Array.isArray(resources) ? resources : []
    };

    course.checkpoints.push(newCheckpoint);
    await course.save();

    res.status(201).json({ message: 'Checkpoint added successfully', checkpoint: newCheckpoint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/courses/:courseId/views - Increment course views
router.patch('/:courseId/views', async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course views updated', views: course.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/courses/:courseId/resources/:resourceId/comments - Add a comment to a resource
router.post('/:courseId/resources/:resourceId/comments', auth, async (req, res) => {
  try {
    const { courseId, resourceId } = req.params;
    const { text } = req.body;
    const userId = req.user;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const resource = course.resources.id(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    const newComment = {
      user: userId,
      text: text.trim(),
      createdAt: new Date()
    };

    resource.comments.push(newComment);
    await course.save();

    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses/:courseId/resources/:resourceId/comments - Get all comments for a resource
router.get('/:courseId/resources/:resourceId/comments', async (req, res) => {
  try {
    const { courseId, resourceId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const resource = course.resources.id(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    res.json({ comments: resource.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
