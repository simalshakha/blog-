const Post = require('../models/post');
const User = require('../models/user');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id; // Support either .userId or .id

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID found in request" });
    }

    // Fetch the user
    const user = await User.findById(userId);
    // console.log("Fetched user:", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all posts belonging to the user
    const posts = await Post.find({ user: userId }).populate("user", "username");
    // console.log("Fetched posts:", posts);
    // Respond with posts and username
    res.json({
      data: posts,
      username: user.fullName
    });
    // console.log("Dashboard data sent successfully:", {
    //   posts: posts.length,
    //   username: user.username,
    // });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.renderAddPost = (req, res) => {
  res.render('admin/add-post', { layout: '../views/layouts/admin' });
};


exports.createPost = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request user:", req.user); // Debugging line to check user info

  try {
    const { title, description, image, tags, content } = req.body;

    // ✅ Basic validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title, description, and content are required.' });
    }


    // ✅ Create new post document
    const newPost = new Post({
      title,
      description,
      image,
      tags: tags,
      content,
      user: req.user.id, // ← comes from authMiddleware after JWT verification
    });

    await newPost.save();
    console.log("✅ Post created:", newPost);

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error("❌ Add post error:", error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.renderEditPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    if (post.user.toString() !== req.user.userId) return res.status(403).send('Forbidden');

    // Extract topics from post
    const topics = post.topics || [];

    res.render('admin/edit-post', { post, topics });
  } catch (error) {
    console.error("Edit post render error:", error);
    res.status(500).send('Server Error');
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, description, image, tags, content } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image,
        tags,
        content,
        user: req.user.id,
        updatedAt: Date.now(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error('Edit post error:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted' });
    // res.redirect('/dashboard');
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getPostById = async (req, res) => {
  try {
    const slug = req.params.id;

    const data = await Post.findById(slug)
    if (!data) return res.status(404).send("Post not found");
    console.log("Post data:", data);
    // const topics = await Topic.find({ post: slug });
    res.json(data);

  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).send("Internal Server Error");
  }
};
