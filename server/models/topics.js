const mongoose = require('mongoose');
const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: true 
    },
    
    link: {
    type: String 
    },

    image: {
         type: String, // URL to image
        required: false // image is optional
    },
    body: {
    type: String,
    required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog', // Reference to Blog
        required: true
    }
});
module.exports = mongoose.model('Topic', topicSchema);