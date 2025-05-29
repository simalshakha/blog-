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
    }
});
module.exports = mongoose.model('Topic', topicSchema);