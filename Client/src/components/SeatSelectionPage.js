import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SeatSelectionPage() {
  const [event, setEvent] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const seatPrice = 150; // Example price per seat

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data.event);
        setBookedSeats(res.data.bookedSeats);
      } catch (err) {
        console.error('Error fetching event data:', err);
        setError('Could not load event data.');
      }
      setLoading(false);
    };

    fetchEventData();
  }, [id]);

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) {
      return; // This seat is already booked
    }

    // Toggle selection
    setSelectedSeats((prevSelected) => {
      if (prevSelected.includes(seatId)) {
        // Deselect
        return prevSelected.filter((s) => s !== seatId);
      } else {
        // Select
        return [...prevSelected, seatId];
      }
    });
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setPaymentDetails({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
    });
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    // Validate payment details based on method
    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        alert('Please fill in all card details.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentDetails.upiId) {
        alert('Please enter your UPI ID.');
        return;
      }
    }

    setBooking(true);
    try {
      // Send the booking to the backend
      const res = await axios.post('/api/bookings', {
        eventId: id,
        seatsBooked: selectedSeats,
        paymentMethod: paymentMethod,
      });

      setBookingData({
        bookingId: res.data.booking._id,
        event: event,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * seatPrice,
        paymentMethod: paymentMethod,
      });
      setBookingConfirmed(true);
      setShowPayment(false);

    } catch (err) {
      console.error('Booking failed:', err);
      alert(`Booking failed. ${err.response?.data?.message || 'Please try again.'}`);
      
      // If the booking failed (e.g., seat was just taken), we should refresh the seat data
      const res = await axios.get(`/api/events/${id}`);
      setBookedSeats(res.data.bookedSeats);
      setSelectedSeats([]); // Clear user's invalid selection
    }
    setBooking(false);
  };

  const handleDownloadTicket = () => {
    if (!bookingData) return;

    const ticketContent = `
DU EVENT BOOKER
═══════════════════════════════════════

TICKET CONFIRMATION
───────────────────────────────────────

Booking ID: ${bookingData.bookingId}
Event: ${bookingData.event.name}
Date: ${new Date(bookingData.event.date).toLocaleDateString()}
Time: ${bookingData.event.time}
Venue: ${bookingData.event.venue}

Seats: ${bookingData.seats.join(', ')}
Total Amount: ₹${bookingData.totalPrice}
Payment Method: ${bookingData.paymentMethod.toUpperCase()}

───────────────────────────────────────
Thank you for your booking!
═══════════════════════════════════════
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${bookingData.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const renderSeatGrid = () => {
    if (!event) return null;

    const { seatRows, seatCols } = event;
    const rows = [];
    const rowChars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ'.substring(0, seatRows);

    for (let i = 0; i < seatRows; i++) {
      const rowChar = rowChars[i];
      const seats = [];
      for (let j = 1; j <= seatCols; j++) {
        const seatId = `${rowChar}${j}`;
        let seatClass = 'seat';

        if (bookedSeats.includes(seatId)) {
          seatClass += ' booked';
        } else if (selectedSeats.includes(seatId)) {
          seatClass += ' selected';
        } else {
          seatClass += ' available';
        }

        seats.push(
          <div
            key={seatId}
            className={seatClass}
            onClick={() => handleSeatClick(seatId)}
          >
            {rowChar}{j}
          </div>
        );
      }
      rows.push(
        <div className="seat-row" key={rowChar}>
          {seats}
        </div>
      );
    }
    return <div className="seat-grid">{rows}</div>;
  };

  if (loading) return <h2>Loading Seat Map...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!event) return <h2>Event not found.</h2>;

  return (
    <div className="seat-selection-container">
      <h2>{event.name}</h2>
      <h3>Select Your Seats</h3>
      
      <div className="screen">SCREEN</div>
      
      {renderSeatGrid()}
      
      <div className="seat-legend">
        <div className="legend-item"><div className="seat available"></div> Available</div>
        <div className="legend-item"><div className="seat selected"></div> Selected</div>
        <div className="legend-item"><div className="seat booked"></div> Booked</div>
      </div>

      {!showPayment && !bookingConfirmed && (
        <div className="booking-summary">
          {selectedSeats.length > 0 ? (
            <>
              <h3>Booking Summary</h3>
              <div className="summary-details">
                <p><strong>Selected Seats:</strong> {selectedSeats.join(', ')}</p>
                <p><strong>Number of Seats:</strong> {selectedSeats.length}</p>
                <p><strong>Price per Seat:</strong> ₹{seatPrice}</p>
                <p className="total-price"><strong>Total Price:</strong> ₹{selectedSeats.length * seatPrice}</p>
              </div>
              <button
                className="proceed-payment-button"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
            </>
          ) : (
            <p>Please select one or more seats to book.</p>
          )}
        </div>
      )}

      {showPayment && !bookingConfirmed && (
        <div className="payment-container">
          <h3>Select Payment Method</h3>
          <div className="payment-methods">
            <button
              className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodSelect('card')}
            >
              💳 Credit/Debit Card
            </button>
            <button
              className={`payment-method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodSelect('upi')}
            >
              📱 UPI
            </button>
            <button
              className={`payment-method-btn ${paymentMethod === 'qr' ? 'active' : ''}`}
              onClick={() => handlePaymentMethodSelect('qr')}
            >
              📷 QR Code
            </button>
          </div>

          {paymentMethod === 'card' && (
            <div className="payment-form">
              <h4>Card Details</h4>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentInputChange}
                  maxLength="19"
                />
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  placeholder="John Doe"
                  value={paymentDetails.cardName}
                  onChange={handlePaymentInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={handlePaymentInputChange}
                    maxLength="5"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={handlePaymentInputChange}
                    maxLength="3"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="payment-form">
              <h4>UPI Details</h4>
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  placeholder="yourname@upi"
                  value={paymentDetails.upiId}
                  onChange={handlePaymentInputChange}
                />
              </div>
            </div>
          )}

          {paymentMethod === 'qr' && (
            <div className="payment-form">
              <h4>Scan QR Code to Pay</h4>
              <div className="qr-code-container">
                <div className="qr-code-placeholder">
                  <img 
                    src="/images/qr.png" 
                    alt="Payment QR Code" 
                    className="qr-code-image"
                  />
                  <p>Scan this QR code with your payment app</p>
                  <p className="qr-amount">Amount: ₹{selectedSeats.length * seatPrice}</p>
                </div>
              </div>
            </div>
          )}

          {paymentMethod && (
            <div className="payment-actions">
              <button
                className="back-button"
                onClick={() => {
                  setShowPayment(false);
                  setPaymentMethod('');
                }}
              >
                Back
              </button>
              <button
                className="confirm-payment-button"
                onClick={handleConfirmPayment}
                disabled={booking}
              >
                {booking ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          )}
        </div>
      )}

      {bookingConfirmed && bookingData && (
        <div className="ticket-confirmation">
          <div className="ticket-success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <h3>Your booking is confirmed</h3>
          <div className="ticket-details">
            <p><strong>Booking ID:</strong> {bookingData.bookingId}</p>
            <p><strong>Event:</strong> {bookingData.event.name}</p>
            <p><strong>Date:</strong> {new Date(bookingData.event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {bookingData.event.time}</p>
            <p><strong>Venue:</strong> {bookingData.event.venue}</p>
            <p><strong>Seats:</strong> {bookingData.seats.join(', ')}</p>
            <p><strong>Total Amount:</strong> ₹{bookingData.totalPrice}</p>
            <p><strong>Payment Method:</strong> {bookingData.paymentMethod.toUpperCase()}</p>
          </div>
          <div className="ticket-actions">
            <button
              className="download-ticket-button"
              onClick={handleDownloadTicket}
            >
              📥 Download Ticket
            </button>
            <button
              className="home-button"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeatSelectionPage;