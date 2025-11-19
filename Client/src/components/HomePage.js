import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const categories = ['Festivals', 'Sport', 'Technology', 'Talent'];

function HomePage({ searchTerm, setSearchTerm }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch events from our backend API
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Build the query parameters
        const params = new URLSearchParams();
        if (selectedCategory) {
          params.append('category', selectedCategory);
        }
        if (searchTerm && searchTerm.trim()) {
          params.append('search', searchTerm.trim());
        }
        
        // Fetch events with the query params
        const queryString = params.toString();
        const url = queryString ? `/api/events?${queryString}` : '/api/events';
        console.log('Fetching events from:', url);
        const res = await axios.get(url);
        console.log('Events received:', res.data);
        setEvents(res.data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        console.error('Error details:', err.response?.data || err.message);
        setEvents([]);
      }
      setLoading(false);
    };

    // We add a short delay (debounce) on the search term
    // so it doesn't fire an API call on every single keystroke
    // But only if searchTerm exists, otherwise fetch immediately
    if (searchTerm && searchTerm.trim()) {
      const searchTimeout = setTimeout(() => {
        fetchEvents();
      }, 300); // 300ms delay
      return () => clearTimeout(searchTimeout);
    } else {
      fetchEvents();
    }
    
  }, [searchTerm, selectedCategory]); // Re-run effect when these change

  const handleClearFilters = () => {
    if (setSearchTerm) setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <>
      <div className="filters-container">
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
            >
              {category}
            </button>
          ))}
          {selectedCategory && (
            <button
              className="category-button clear-button"
              onClick={handleClearFilters}
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      <div className="event-list-container">
        {loading && <div className="loading-spinner"><h2>Loading events...</h2></div>}
        {!loading && events.length === 0 && (
          <div className="no-events-message">
            <h2>No events found</h2>
            <p>Try selecting a different category or clearing the search.</p>
          </div>
        )}
        {!loading && events.length > 0 && (
          <>
            <h2 className="events-section-title">
              {selectedCategory ? `${selectedCategory} Events` : 'All Events'} 
              <span className="events-count">({events.length})</span>
            </h2>
            <div className="event-grid">
              {events.map((event) => (
                <Link
                  to={`/event/${event._id}`}
                  key={event._id}
                  className="event-card"
                >
                  <div className="event-card-image-wrapper">
                    <img src={event.posterUrl} alt={event.name} />
                    <span className="event-card-category">{event.category}</span>
                  </div>
                  <div className="event-card-content">
                    <h2>{event.name}</h2>
                    <div className="event-card-details">
                      <p className="event-date">
                        <span className="icon">📅</span>
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="event-time">
                        <span className="icon">🕐</span>
                        {event.time}
                      </p>
                      <p className="event-venue">
                        <span className="icon">📍</span>
                        {event.venue}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default HomePage;