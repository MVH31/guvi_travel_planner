import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyItineraries = async () => {
      if (!isAuthenticated() || !token) {
        setError('You must be logged in to view your itineraries');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('http://localhost:3001/api/itinerary/my-itineraries', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch itineraries: ${response.status}`);
        }

        const data = await response.json();
        setItineraries(data.itineraries || data || []);
        console.log('✅ Successfully fetched itineraries:', data);

      } catch (error) {
        console.error('❌ Error fetching itineraries:', error);
        setError(error.message || 'Failed to load your itineraries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyItineraries();
  }, [token, isAuthenticated]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (itineraryId) => {
    if (!window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/itinerary/${itineraryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete itinerary: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Successfully deleted itinerary:', data);

      // Update local state to remove the deleted itinerary
      setItineraries(prevItineraries => 
        prevItineraries.filter(itinerary => itinerary._id !== itineraryId)
      );

    } catch (error) {
      console.error('❌ Error deleting itinerary:', error);
      alert(error.message || 'Failed to delete itinerary');
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-state">
            <h2>Access Denied</h2>
            <p className="error-message">You must be logged in to view this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="user-info">
            <h2>Welcome, {user?.name || user?.email}!</h2>
            <p className="member-since">
              Member since: {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>

        {/* Itineraries Section */}
        <div className="itineraries-section">
          <h3>My Travel Itineraries</h3>
          
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your itineraries...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">❌ {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="retry-button"
              >
                Try Again
              </button>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any itineraries yet.</p>
              <p>Start planning your next adventure!</p>
            </div>
          ) : (
            <div className="itineraries-list">
              {itineraries.map((itinerary, index) => (
                <div key={itinerary._id || index} className="itinerary-card">
                  <div className="itinerary-header">
                    <h4 className="trip-title">{itinerary.tripTitle}</h4>
                    <div className="card-actions">
                      <span className="created-date">
                        Created: {formatDate(itinerary.createdAt)}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(itinerary._id);
                        }}
                        className="delete-button"
                        title="Delete this itinerary"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/itinerary/${itinerary._id}`}
                    className="itinerary-link"
                  >
                    {itinerary.summary && (
                      <p className="trip-summary">{itinerary.summary}</p>
                    )}
                    
                    <div className="itinerary-meta">
                      {itinerary.dailyPlan && (
                        <span className="days-count">
                          {itinerary.dailyPlan.length} day{itinerary.dailyPlan.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="view-details">View Details →</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {!isLoading && !error && itineraries.length > 0 && (
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{itineraries.length}</span>
                <span className="stat-label">Total Itineraries</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {itineraries.reduce((total, itinerary) => 
                    total + (itinerary.dailyPlan?.length || 0), 0
                  )}
                </span>
                <span className="stat-label">Total Days Planned</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;