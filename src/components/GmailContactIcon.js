// src/components/GmailContactIcon.js
import React from 'react';
import './GmailContactIcon.css';

const GmailContactIcon = () => {
  return (
    <a
      href="mailto:tradeaxis1st@gmail.com"
      className="gmail-contact-icon"
      title="Contact Support"
      aria-label="Email Support"
    >
      ✉️
    </a>
  );
};

export default GmailContactIcon;