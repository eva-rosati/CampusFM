import React from 'react';
import '../styles/Landing.css';

export default function Landing() {
  return (
    <div className="landing-container">
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
      <div className="blob blob4"></div>
      <div className="blob blob5"></div>
      <div className="blob blob6"></div>
      <div className= "blob blob7"></div>


      <div className="content">
        <h1>Welcome to CampusFM</h1>
        <p>Find your frequency</p>
        <button
          onClick={() => window.location.href = 'https://fierce-bayou-71060-279ece732152.herokuapp.com/login'}
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
}

