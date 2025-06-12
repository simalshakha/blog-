const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const authController = require('../controllers/auth');
const postController = require('../controllers/post');
const adminController = require('../controllers/admincontroller');
// const topicController = require('../controllers/topiccontroller');

// Auth
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

// Admin
router.get('/login', adminController.getAdminPage);
router.get('/dashboard', auth, postController.getDashboard);

// Posts
router.get('/add-post', auth, postController.renderAddPost);
router.get('/edit-post/:id', auth, postController.renderEditPost);
router.put('/edit-post/:id', auth, postController.updatePost);
router.delete('/delete-post/:id', auth, postController.deletePost);



router.post('/add-post',auth,postController.createPost);

module.exports = router;
