const Post = require('../models/post');
const User = require('../models/user');
const Topic = require('../models/topics');

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
  try {
    const { title, body, image } = req.body;
    const newPost = new Post({ title, body, image, user: req.user.userId });
    await newPost.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Add post error:", error);
    res.status(500).send('Internal Server Error');
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

    const data = await Post.findById(slug).populate('user', 'username');
    if (!data) return res.status(404).send("Post not found");

    const topics = await Topic.find({ post: slug });

    res.render('post', {
      data,
      username: data.user.username,
      topics,
      
    });

  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).send("Internal Server Error");
  }
};
