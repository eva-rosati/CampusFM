// mongodb schema for users

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
    accessToken: {
        ciphertext : { type:String, required: true },
        iv : { type:String, required: true },
        tag : { type:String, required: true },
    },
    refreshToken : {
        ciphertext : { type:String, required: true },
        iv : { type:String, required: true },
        tag : { type:String, required: true },
    }
});

module.exports = mongoose.model('User', userSchema);
// this will create a collection called users in the database
// if the collection already exists, it will use the existing collection