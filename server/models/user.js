const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // 👈 ensures no duplicate usernames
    },
    image: {
        type: String, // URL to image
        required: false // image is optional
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema); 
