const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    },
    bio:{
        type:String,
        required:false
    },
    profile_pic: {
        type: String, 
        required: false
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema); 
