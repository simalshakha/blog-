const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const authController = require('../controllers/auth');
const postController = require('../controllers/post');
const adminController = require('../controllers/admincontroller');
const Post = require('../models/post');
const checkRole = require('../middleware/rbauth');       // our RBAC middleware

// GET /users (admin-only)
router.get(
  '/users',
  auth,            // must come before role check
  checkRole('admin'),        // only allow admins
  (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching users' });
      }
      res.status(200).json({ users });
    });
  }
);
router.delete('/users/:id', auth,checkRole('admin'), (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting user' });
    }
    res.status(204).send();
  });
});

// Auth
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);


router.get('/dashboard', auth, postController.getDashboard);

// Posts
router.get('/add-post', auth, postController.renderAddPost);
router.get('/edit-post/:id', auth, postController.renderEditPost);
router.put('/edit-post/:id', auth, postController.updatePost);
router.delete('/delete-post/:id', auth, postController.deletePost);



router.post('/add-post',auth,postController.createPost);


router.put('/post/:id/content', auth, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || typeof content !== 'object') {
    return res.status(400).json({ message: 'Invalid or missing content' });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
