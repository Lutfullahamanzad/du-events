// client/src/components/Header.js

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header({ searchTerm, setSearchTerm }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const showSearch = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="logo-container" onClick={() => navigate('/')}>
        <span className="logo-text">DU Event</span>
        <span className="logo-booker">Booker</span>
      </div>
      
      {showSearch && (
        <div className="header-search-container">
          <input
            type="text"
            className="header-search-bar"
            placeholder="Search for events..."
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      <div className="auth-links">
        {user ? (
          // If user is logged in
          <div className="profile-menu">
            <div 
              className="profile-circle" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user.username[0].toUpperCase()}
            </div>
            
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-username">{user.username}</div>
                <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                  My Profile
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          // If user is logged out
          <>
            <Link to="/login" className="auth-link-button">Login</Link>
            <Link to="/register" className="auth-link-button register">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;