const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['image', 'text', 'header'], // one of the component types
        required: true
    },
    content: {
        type: String,
        required: true // holds text, header, or image URL based on type
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    }
});

module.exports = mongoose.model('Topic', topicSchema);
