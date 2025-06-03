import express from 'express';
import auth from '../middleware/auth.js';
import Post from '../models/Posts.js';

const router = express.Router();

// Create a new post
router.post('/createpost', auth, async (req, res) => {
  try {
    const post = new Post({ user: req.user._id, content: req.body.content });
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
    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comment on post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ user: req.user._id, text: req.body.text });
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
//     if (!post.reposts.includes(req.user._id)) {
//       post.reposts.push(req.user._id);
//       await post.save();
//     }
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

export default router;
