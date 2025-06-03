const Topic = require('../models/topics');
const Post = require('../models/post');
const topics = require('../models/topics');

exports.renderAddTopics = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username');
    if (!post) return res.status(404).send('Post not found');

    res.render('admin/add-topics', { postId: post._id });
  } catch (error) {
    console.error("Render add topics error:", error);
    res.status(500).send('Internal Server Error');
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { type, content } = req.body;
  
    console.log("Creating topic with type:", type, "and content:", content,"req.body:", req.params.id);


    if (!['image', 'text', 'header'].includes(type)) {
      return res.status(400).send('Invalid topic type');
    }
    // await Topic.deleteMany({})
    
    const topic = new Topic({
      type,
      content,
      post: req.params.id
    });

    await topic.save();
    // res.redirect('/dashboard');
  } catch (error) {
    console.error("Create topic error:", error);
    res.status(500).send('Internal Server Error');
  }
};
