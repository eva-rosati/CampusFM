// this file is to create the user, all the qualities and requirements that define them
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    spotifyID : {
        type : String, 
        required : true, 
        unique: true
    }, 
    email : {
        type : String, 
        required : [true, "Please enter your email address"], 
        unique : true, //cannot have duplicate emails
        validate : [validator.isEmail, "Please enter a valid email address"]
    },
    displayName : String, 
});

module.exports = mongoose.model('User', userSchema);
// this will create a collection called users in the database
// if the collection already exists, it will use the existing collection