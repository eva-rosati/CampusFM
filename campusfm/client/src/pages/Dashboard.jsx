import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);

  useEffect(() => {
    fetch('https://fierce-bayou-71060-279ece732152.herokuapp.com/api/spotify/top-tracks', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setTopTracks(data.items ? data.items.map(track => track.name) : [])); // ensure they are always arrays, avoiding map errors
      // extract array from items
  
    fetch('https://fierce-bayou-71060-279ece732152.herokuapp.com/api/spotify/top-artists', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setTopArtists(data.items ? data.items.map(artist => artist.name) : []));
  
    fetch('https://fierce-bayou-71060-279ece732152.herokuapp.com/api/spotify/top-genres', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setTopGenres(Array.isArray(data) ? data : []));
  }, []);
  

  return (
    <>
    <h1 className="dashboard-title">Welcome to the Dashboard</h1>
    <div className="dashboard-container">
      <div className="section-card">
        <h2>Your Top Tracks</h2>
        <ul>{topTracks.map((track, i) => <li key={i}>{track}</li>)}</ul>
      </div>
      <div className="section-card">
        <h2>Your Top Artists</h2>
        <ul>{topArtists.map((artist, i) => <li key={i}>{artist}</li>)}</ul>
      </div>
      <div className="section-card">
        <h2>Your Top Genres</h2>
        <ul>{topGenres.map((genre, i) => <li key={i}>{genre}</li>)}</ul>
      </div>
    </div>
    </>
  );
}