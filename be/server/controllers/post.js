const Post = require('../models/post');
const User = require('../models/user');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('username');
    if (!user) return res.status(404).send('User not found');

    const data = await Post.find({ user: req.user.userId }).populate('user', 'username');
    res.render('admin/dashboard', {
      layout: '../views/layouts/admin',
      locals: { title: 'Dashboard', description: 'Blog dashboard' },
      data,
      username: user.username,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send('Internal Server Error');
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
    const { title, body, image, topics } = req.body;

    // If topics is not an array, convert it to one
    const formattedTopics = Array.isArray(topics)
      ? topics.map(t => ({
          type: t.type,
          content: t.content
        }))
      : Object.values(topics || {}).map(t => ({
          type: t.type,
          content: t.content
        }));

    await Post.findByIdAndUpdate(req.params.id, {
      title,
      body,
      image,
      topics: formattedTopics,
      updatedAt: Date.now()
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error("Edit post error:", error);
    res.status(500).send('Internal Server Error');
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
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
