const express = require('express'); // import express
const querystring = require('querystring');
const router = express.Router(); // create a new router instance
const axios = require('axios'); // import axios for making HTTP requests
const User = require('../models/users.js'); // import the User model


const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

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
  const scope = 'user-read-private user-read-email'; // asking the user for these permissions with their data

  // redirecting to the spotify login page
  res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({ // query parameters
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri, // redirect after they log in
      state: state
    }));
});


router.get('/callback', async function(req, res) {
  const code = req.query.code || null; // user-specific to used for auth tokens
  const state = req.query.state || null; // security 

  if (state === null) {
    return res.redirect('/#' +
      querystring.stringify({ error: 'state_mismatch' }));
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
          'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        }
      }
    );

    const access_token = tokenResponse.data.access_token; // extract tokens from the response, temp token
    const refresh_token = tokenResponse.data.refresh_token; // allows user to not repeatedly have to login

    res.json({
      message: 'Success! Tokens received.',
      access_token,
      refresh_token
    });

  } catch (error) { // catch any errors in the token exchange process
    console.error('Error getting tokens:', error.response?.data || error.message);
    res.status(500).send('Error during authentication');
  }
});


module.exports = router; //export for index.js to use
