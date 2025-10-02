import React from 'react';
import DayCard from './DayCard';
import Map from './Map';
import SafetyInfo from './SafetyInfo';
import '../styles/Itinerary.css';

const Itinerary = ({ itinerary }) => {
  return (
    <div className="itinerary-container">
      
      <Map dailyPlan={itinerary.dailyPlan} />

      <h2 className="trip-title">{itinerary.tripTitle}</h2>
      <p className="trip-summary">{itinerary.summary}</p>

      <div className="daily-plan">
        {itinerary.dailyPlan.map(day => (
          <DayCard key={day.day} dayData={day} />
        ))}
      </div>

      <SafetyInfo guidance={itinerary.safetyGuidance} />
    </div>
  );
};

export default Itinerary;