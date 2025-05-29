const express = require('express');
const router = express.Router();

const Post = require('../models/post'); 
const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminLayout = '../views/layouts/admin';

// ✅ Add dotenv if needed and load environment variables
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

// 🔐 Middleware to protect routes
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
router.get('/admin', async (req, res) => {
    try {
        
        res.render('admin/index',{layout: adminLayout}); 

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log("📥 Login request received:", { username, password });

        const user = await User.findOne({ username });

        if (!user) {
            console.log("❌ User not found");
            return res.status(401).send('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("❌ Invalid password");
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        console.log("🔑 JWT Token generated:", token);

        res.cookie('token', token, { httpOnly: true });
        console.log("✅ Cookie set. Redirecting to /dashboard");

        res.redirect('/dashboard');

    } catch (error) {
        console.error("❌ Error in login route:", error);
        return res.status(500).send('Internal Server Error');
    }
});





// 🟢 Dashboard - view posts
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        };

        const data = await Post.find();
        console.log("📄 Dashboard post data:", data);

        res.render('admin/dashboard', {
            locals,
            data, // ✅ must pass "data" for EJS
            layout: adminLayout
        });

    } catch (error) {
        console.log("❌ Error loading dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 🟢 Add post form
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        res.render('admin/add-post', { layout: adminLayout }); // if you have a form
    } catch (error) {
        console.log("❌ Error rendering add-post page:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 🟢 Add post handler
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        const { title, body } = req.body;
        const newPost = new Post({ title, body });
        await newPost.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.log("❌ Error adding post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 🟢 User registration
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("📥 Incoming registration request:", { username, password });

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });

        console.log("✅ User created:", newUser);
        return res.status(201).json({ message: 'User created', user: newUser });

    } catch (error) {
        console.error("❌ Registration error:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'User already exists' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// 🟢 Edit post
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.log("❌ Error editing post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 🟢 Delete post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log("❌ Error deleting post:", error);
        res.status(500).send("Internal Server Error");
    }
});

// 🟢 Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;
