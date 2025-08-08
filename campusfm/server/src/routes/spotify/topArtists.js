const express = require('express');
const router = express.Router();
const User = require('../../models/users.js');

router.get('/top-artists', async (req, res) => {
  const spotifyID = req.session.spotifyID;

  if (!spotifyID) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = await User.findOne({ spotifyID });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      items: user.topArtists.map(artistName => ({ name: artistName }))
    });
  } catch (error) {
    console.error('Error fetching top artists from DB:', error);
    res.status(500).json({ error: 'Failed to fetch top artists from DB' });
  }
});

module.exports = router;
