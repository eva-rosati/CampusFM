const express = require('express');
const router = express.Router();
const User = require('../models/users.js');

router.get('/similar-users', async (req,res) =>{
    const accessToken = req.session.accessToken; // authenticate api request on user behalf
    if (!accessToken) return res.status(401).json({ error: 'Unauthorized' });
 


module.exports = router;