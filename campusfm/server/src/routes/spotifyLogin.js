// managing the spotify authorization flow

const express = require('express'); // import express
const querystring = require('querystring');
const router = express.Router(); // create a new router instance
const axios = require('axios'); // import axios for making HTTP requests
const User = require('../models/users.js'); // import the User model
const crypto = require('crypto'); // for encrypting tokens
const { encryptSymmetric, decryptSymmetric } = require('../utils/tokenSafety.js');


const client_id=process.env.SPOTIFY_CLIENT_ID;
const client_secret=process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri=process.env.SPOTIFY_REDIRECT_URI.trim();

function generateRandomString(length) { // generating a random, string and sending as state parameter verif legit request frm spotify
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; //characters to use
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length)); //pick a random character
    }
  
    return text; 
  }

router.get('/login', function(req, res) {
  const state = generateRandomString(16); // each request has a different state value, protect against CSRF attacks
  req.session.state = state ;
  const scope = 'user-read-private user-read-email user-top-read'; // asking the user for these permissions with their data
  
  // redirecting to the spotify login page
  res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({ // query parameters
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri, // redirect after they log in
      state: state
    }));
  console.log('Session state set:', req.session.state);

});


router.get('/callback', async function(req, res) {
  console.log('Received callback with state:', req.query.state);
  console.log('Session state:', req.session.state);
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  
  const code = req.query.code || null; // user-specific to used for auth tokens
  const state = req.query.state || null; // security 
 
  if (state !== req.session.state) {
    return res.redirect('/#' +
      querystring.stringify({ error: 'state_mismatch' }));
  }
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
  }

  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', // auth code exchanged for token by secure POST request
      querystring.stringify({
        code: code, // ony use once, use tokens to access api
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
        }
      }
    );

    const { access_token, refresh_token } = tokenResponse.data; // extract tokens from the response, temp token
    req.session.accessToken = access_token; // save to session
    

    // encrypt tokens using the imported encryption function 
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const encryptedAccessToken = encryptSymmetric(encryptionKey, access_token);
    const encryptedRefreshToken = encryptSymmetric(encryptionKey, refresh_token);

    const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${access_token}` // use the access token to authenticate the request
      }
    });

    console.log('User profile response:', userProfileResponse.data);
    console.log('Token response:', tokenResponse.data);
    // get user info from spotify
    const { id: spotifyID, display_name: displayName, email } = userProfileResponse.data;

    const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    const topArtists = topArtistsResponse.data.items.map(artist => artist.name);
    const topGenres = [...new Set(topArtistsResponse.data.items.flatMap(artist => artist.genres))];
    
    const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    const topTracks = topTracksResponse.data.items.map(track => track.name);
    // create new user in the database and save encrypted tokens
    await User.findOneAndUpdate( // automatically checks for duplicate users
      { spotifyID },
      {
        spotifyID,
        email,
        displayName,
        accessToken: {
          ciphertext: encryptedAccessToken.ciphertext,
          iv: encryptedAccessToken.iv,
          tag: encryptedAccessToken.tag
        },
        refreshToken: {
          ciphertext: encryptedRefreshToken.ciphertext,
          iv: encryptedRefreshToken.iv,
          tag: encryptedRefreshToken.tag
        },
        topArtists,
        topGenres, 
        topTracks
      },
      { upsert: true, new: true }
    );

    res.redirect('http://localhost:5173/dashboard');

  } catch (error) { // catch any errors in the token exchange process
    console.error('Error getting tokens:', error.response?.data || error.message);
    res.status(500).send('Error during authentication');
  }
  console.log('Session state:', req.session.state, 'Returned state:', state);
});


module.exports = router; //export for index.js to use
