const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name : {
        type : String, 
        required : [true, "Please enter your name"]
    }, 
    email : {
        type : String, 
        required : [true, "Please enter your email address"], 
        unique : true, //cannot have duplicate emails
        validate : [validator.isEmail, "Please enter a valid email address"]
    },
    role : {
        type: String,
        enum : {
            values : ['student', 'employer'],
            message : 'Please select correct role for user'
        },
        default : 'user'
    }

});