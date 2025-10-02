import React from 'react';
import '../styles/SafetyInfo.css';

const SafetyInfo = ({ guidance }) => {
  if (!guidance) return null;

  return (
    <div className="safety-container">
      <h3 className="safety-title">Safety Guidance</h3>
      <div className="safety-content">
        <h4>General Tips:</h4>
        <ul>
          {guidance.generalTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
        <h4>Emergency Contacts:</h4>
        <div className="contacts">
          <p><strong>Police:</strong> {guidance.emergencyContacts.police}</p>
          <p><strong>Ambulance:</strong> {guidance.emergencyContacts.ambulance}</p>
        </div>
      </div>
    </div>
  );
};

export default SafetyInfo;