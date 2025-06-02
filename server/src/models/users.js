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
    },
    password : {
        type : String, 
        required : [true, "Please enter a password for your account"],
        minlength : [8, 'Your password must be at least 8 characters long'],
        select : false //hide password
    },
    createdAt : {
        type : Date, 
        default : Date.now
    }, 
    resetPasswordToken : String, 
    resetPasswordExprire : Date

});

module.exports = mongoose.model('User', userSchema);
// this will create a collection called users in the database
// if the collection already exists, it will use the existing collection