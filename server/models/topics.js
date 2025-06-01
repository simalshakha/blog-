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
        type: String, 
        required: false 
    },
    body: {
    type: String,
    required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog', 
        required: true
    }
});
module.exports = mongoose.model('Topic', topicSchema);