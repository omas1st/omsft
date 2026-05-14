// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background.png'; // can be .gif, .jpg, .png, etc.
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay">
        <h1>OMS</h1>
        <div className="buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;