import express from 'express';
import auth from '../middleware/auth.js';
import Post from '../models/Posts.js';
import validator from 'validator';

const router = express.Router();

// Create a new post
router.post('/createpost', auth, async (req, res) => {
  let { content } = req.body;

  // Validate content
  if (!content || typeof content !== 'string' || validator.isEmpty(content.trim())) {
    return res.status(400).json({ message: 'Content is required' });
  }

  // Sanitize content
  content = content.trim();

  try {
    const post = new Post({ user: req.user, content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like or Unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const alreadyLiked = post.likes.includes(req.user);
    if (alreadyLiked) {
      post.likes.pull(req.user);
    } else {
      post.likes.push(req.user);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single post by ID (with user and comments' user info)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name avatar username')
      .populate('comments.user', 'name avatar');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comment on post
router.post('/:id/comment', auth, async (req, res) => {
  let { text } = req.body;

  // Validate comment text
  if (!text || typeof text !== 'string' || validator.isEmpty(text.trim())) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  // Sanitize comment text
  text = validator.escape(text);

  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ user: req.user, text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Repost
// router.post('/:id/repost', auth, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post.reposts.includes(req.user.id)) {
//       post.reposts.push(req.user.id);
//       await post.save();
//     }
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;
