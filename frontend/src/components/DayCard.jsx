import React from 'react';
import '../styles/DayCard.css';

// --- Helper function to get future dates ---
const getFutureDate = (daysToAdd) => {
  const date = new Date();
  // Find the next Monday to start the trip
  const dayOfWeek = date.getDay();
  const daysUntilMonday = (1 + 7 - dayOfWeek) % 7 || 7;
  date.setDate(date.getDate() + daysUntilMonday + daysToAdd);
  return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
};

const DayCard = ({ dayData }) => {
  const checkinDate = getFutureDate(dayData.day - 1);
  const checkoutDate = getFutureDate(dayData.day);

  // Construct more specific, pre-populated search links
  const hotelSearchLink = `https://www.booking.com/searchresults.html?ss=${dayData.city}&checkin=${checkinDate}&checkout=${checkoutDate}&group_adults=2`;
  const flightSearchLink = `https://www.google.com/flights?q=Flights+to+${dayData.city}+on+${checkinDate}`;

  return (
    <div className="day-card">
      <div className="card-header">
        <h3 className="day-header">Day {dayData.day}: {dayData.city} - <span className="theme">{dayData.theme}</span></h3>
        <div className="booking-links">
          <a href={hotelSearchLink} target="_blank" rel="noopener noreferrer" className="booking-button hotels">
            🏨 Book Hotels
          </a>
          <a href={flightSearchLink} target="_blank" rel="noopener noreferrer" className="booking-button flights">
            ✈️ Book Flights
          </a>
        </div>
      </div>
      <div className="day-content">
        <h4>Attractions:</h4>
        <ul>
          {dayData.attractions.map((attraction, index) => (
            <li key={index}>{attraction}</li>
          ))}
        </ul>
        <div className="food-suggestion">
          <strong>Food Suggestion:</strong> {dayData.foodSuggestion}
        </div>
      </div>
    </div>
  );
};

export default DayCard;