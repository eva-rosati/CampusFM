const express = require('express'); // import express
const path = require('path');
const bcrypt = require('bcrypt'); // import library to hash passwords

const app = express();  // create an express application

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('login'); // call back function, render login page
});

app.get("/signup", (req,res) => {
    res.render('signup'); // render signup page
}
);

const port =5000;

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})