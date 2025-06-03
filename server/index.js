require('dotenv').config(); // load environment variables from .env file

const express = require('express'); // import express
const mongoose = require('mongoose'); // import mongoose for MongoDB connection

const app = express(); // create instance of an express application

// get variables from process.env
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// connect to mongodb
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// useNewUrlParser and useUnifiedTopology are options to avoid warnings and use latest drivers
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
// send back response when local browser is hosted

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// start listening for requests on the specified port
