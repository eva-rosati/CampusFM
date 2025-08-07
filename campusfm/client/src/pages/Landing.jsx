import React from 'react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 text-white px-6">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center drop-shadow-lg">
        Welcome to CampusFM
      </h1>

      <p className="max-w-xl text-center text-lg md:text-xl mb-12 drop-shadow-md">
        Find your frequency
      </p>

      <button
        onClick={() => window.location.href = 'https://fierce-bayou-71060-279ece732152.herokuapp.com/login'}
        className="bg-white text-pink-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-pink-100 transition duration-300"
      >
        Login with Spotify
      </button>
    </div>
  );
}
