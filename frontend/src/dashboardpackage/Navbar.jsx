import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  // Helper to check if a path is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>M&A Due Diligence</h1>
        </Link>
      </div>
      
      <ul className="navbar-menu">
        <li className={isActive('/dashboard') ? 'active' : ''}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className={isActive('/transactions') && !isActive('/dashboard') ? 'active' : ''}>
          <Link to="/dashboard">Transactions</Link>
        </li>
        <li>
          <Link to="/reports">Reports</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
      
      <div className="navbar-user">
        <div className="user-avatar">JD</div>
        <span className="user-name">John Doe</span>
      </div>
    </nav>
  );
};

export default Navbar;
