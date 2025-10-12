import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">&lt;&gt;</span>
        <span className="logo-text">AgentQL</span>
      </div>
      <div className="navbar-credit">
        Made by Gaurav
      </div>
    </nav>
  );
};

export default Navbar;