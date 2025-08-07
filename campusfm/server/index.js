// server setup and mongodb connect

require('dotenv').config({ path: __dirname + '/.env' }); // explicitly load .env file
console.log('MONGO_URI:', process.env.MONGO_URI); // debug log to verify MONGO_URI

const express = require('express'); // import express
const mongoose = require('mongoose'); // import mongoose for MongoDB connection
const spotifyLoginRouter = require('./src/routes/spotifyLogin'); 
const session = require('express-session');
const MongoStore = require('connect-mongo'); // use to avoid memory leaks, preparing for production
const cors = require('cors'); // allow localhost frontend to interact with backend



const app = express(); // create instance of an express application


// get variables from process.env
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// connect to mongodb
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})// useNewUrlParser and useUnifiedTopology are options to avoid warnings and use latest drivers
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));


  app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true                 // allow sending cookies/session credentials
  }));

  const isProduction = process.env.NODE_ENV === 'production'; //cross origin cookie sharing

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? 'none':'lax',
      httpOnly: true,
      maxAge: 24*60*60*1000,
    },
    
    
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

