// server setup and mongodb connect

require('dotenv').config({ path: __dirname + '/.env' }); // explicitly load .env file
console.log('MONGO_URI:', process.env.MONGO_URI); // debug log to verify MONGO_URI

const express = require('express'); // import express
const mongoose = require('mongoose'); // import mongoose for MongoDB connection
const spotifyLoginRouter = require('./src/routes/spotifyLogin'); 
const session = require('express-session');


const app = express(); // create instance of an express application


// get variables from process.env
const PORT = process.env.PORT_HOST || 3000;
const MONGO_URI = process.env.MONGO_URI;

// connect to mongodb
mongoose.connect(MONGO_URI)
// useNewUrlParser and useUnifiedTopology are options to avoid warnings and use latest drivers
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));


  app.use(session({
    secret: process.env.SESSION_SECRET || process.env.SESSION_SECRET, // Use a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })); 

app.use('/', spotifyLoginRouter);


app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
// send back response when local browser is hosted

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// start listening for requests on the specified port

