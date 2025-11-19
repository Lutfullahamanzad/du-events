// client/src/components/ProfilePage.js

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProfilePage() {
  const { user } = useAuth();

  // If user is not logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="form-container">
      <h2>My Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="profile-section">
        <h3>Account Settings</h3>
        <p><em>(Update password, change email, etc. - coming soon!)</em></p>
      </div>

      <div className="profile-section">
        <h3>My Bookings</h3>
        <p><em>(A list of all past event bookings will show here - coming soon!)</em></p>
      </div>
    </div>
  );
}

export default ProfilePage;