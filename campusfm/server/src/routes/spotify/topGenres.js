const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/top-genres', async (req,res) =>{
    const accessToken = req.session.accessToken; // authenticate api request on user behalf
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        // get genres from top artists by extracting the genres since api endpoint dne
        const genres = [...new Set(response.data.items.flatMap(artist => artist.genres))];
        // creates an array of unique genre strings

        res.json(genres); // send to client
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top genres' });
      }
    });


module.exports = router;