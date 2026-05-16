// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background.png';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="overlay">
        {/* Main content */}
        <div className="hero-content">
          <h1 className="brand">TradeAxis</h1>
          <p className="tagline">Trade with Confidence</p>
          <div className="buttons">
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p className="footer-text">
            TradeAxis Ltd is a Securities Dealer registered in Seychelles with registration number 28121997-1 and authorised by the Financial Services Authority (FSA) with licence number MS028.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;