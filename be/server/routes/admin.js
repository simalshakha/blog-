const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const authController = require('../controllers/auth');
const postController = require('../controllers/post');
const adminController = require('../controllers/admincontroller');
// const topicController = require('../controllers/topiccontroller');

// Auth
router.post('/admin', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

// Admin
router.get('/admin', adminController.getAdminPage);
router.get('/dashboard', auth, postController.getDashboard);

// Posts
router.get('/add-post', auth, postController.renderAddPost);
router.get('/edit-post/:id', auth, postController.renderEditPost);
router.post('/edit-post/:id', auth, postController.updatePost);
router.delete('/delete-post/:id', auth, postController.deletePost);



router.post('/add-post',postController.createPost);

module.exports = router;
