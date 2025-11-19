import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Gets the :id from the URL

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // This endpoint gets the event *and* its booked seats
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data.event); 
      } catch (err) {
        console.error('Error fetching event:', err);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <h2>Loading event details...</h2>;
  }

  if (!event) {
    return <h2>Event not found.</h2>;
  }

  return (
    <div className="event-detail-container">
      <img src={event.posterUrl} alt={event.name} />
      <h1>{event.name}</h1>
      <div className="event-detail-info">
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p>{event.description}</p>
      </div>
      <Link to={`/book/${event._id}`} className="book-now-button">
        Book Tickets
      </Link>
    </div>
  );
}

export default EventDetailPage;