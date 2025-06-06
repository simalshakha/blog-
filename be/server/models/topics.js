const mongoose = require('mongoose');
const topicSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'header'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
});

module.exports = mongoose.model('Topic', topicSchema);
