const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/top-tracks', async (req,res) =>{
    const accessToken = req.session.accessToken; // authenticate api request on user behalf
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.json(response.data); // send to client
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top tracks' });
      }
    });


module.exports = router;