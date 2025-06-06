const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // Store image URL or base64 string
  },
  tags: [{
    type: String,
    trim: true,
  }],
  content: {
    type: Object, // Stores the full Editor.js output (blocks, time, version, etc.)
    required: true,
  },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Post', PostSchema);