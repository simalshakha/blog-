const Topic = require('../models/topics');
const Post = require('../models/post');

exports.renderAddTopics = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username');
    if (!post) return res.status(404).send('Post not found');

    res.render('admin/add-topics', { post });
  } catch (error) {
    console.error("Render add topics error:", error);
    res.status(500).send('Internal Server Error');
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { name, image, body } = req.body;
    const topic = new Topic({ name, image, body, post: req.params.id });
    await topic.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Create topic error:", error);
    res.status(500).send('Internal Server Error');
  }
};
