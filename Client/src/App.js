// client/src/App.js

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // <-- Import Header
import HomePage from './components/HomePage';
import EventDetailPage from './components/EventDetailPage';
import SeatSelectionPage from './components/SeatSelectionPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage'; // <-- Import ProfilePage

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="App">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> {/* <-- Use Header component */}
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/book/:id" element={<SeatSelectionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* <-- Add route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;