// server setup and mongodb connect

require('dotenv').config({ path: __dirname + '/.env' }); // explicitly load .env file
console.log('MONGO_URI:', process.env.MONGO_URI); // debug log to verify MONGO_URI

const express = require('express'); // import express
const mongoose = require('mongoose'); // import mongoose for MongoDB connection
const session = require('express-session');
const MongoStore = require('connect-mongo'); // use to avoid memory leaks, preparing for production
const cors = require('cors'); // allow localhost frontend to interact with backend
const cookieParser = require('cookie-parser');



const app = express(); // create instance of an express application

app.use(express.json());
app.use(cookieParser());

app.set('trust proxy', 1); 


// get variables from process.env
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
    origin: [//'http://localhost:5173',
      //'https://ambent-tiramisu-637bf2.netlify.app'
      'https://campusfm.org'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      httpOnly: true,
      maxAge: 24*60*60*1000,
    },
    
    
  }));


app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    next();
  });

  // connect to mongodb
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  })// useNewUrlParser and useUnifiedTopology are options to avoid warnings and use latest drivers
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));


// import routers
const spotifyLoginRouter = require('./src/routes/spotifyLogin');
const topTracksRouter = require('./src/routes/spotify/topTracks');
const topArtistsRouter = require('./src/routes/spotify/topArtists');
const topGenresRouter = require('./src/routes/spotify/topGenres');

// create endpoints
app.use('/', spotifyLoginRouter);
app.use('/api/spotify', topTracksRouter);
app.use('/api/spotify', topArtistsRouter);
app.use('/api/spotify', topGenresRouter);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// start listening for requests on the specified port
