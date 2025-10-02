import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Itinerary from '../components/Itinerary.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import '../styles/ProfilePage.css';

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!isAuthenticated() || !token) {
        setError('You must be logged in to view this itinerary');
        setIsLoading(false);
        return;
      }

      if (!id) {
        setError('No itinerary ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3001/api/itinerary/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          
          if (response.status === 401) {
            throw new Error('You are not authorized to view this itinerary');
          } else if (response.status === 404) {
            throw new Error('Itinerary not found');
          } else {
            throw new Error(errorData.error || `Failed to fetch itinerary: ${response.status}`);
          }
        }

        const data = await response.json();
        setItinerary(data.itinerary);
        console.log('✅ Successfully fetched itinerary:', data);

      } catch (error) {
        console.error('❌ Error fetching itinerary:', error);
        setError(error.message || 'Failed to load itinerary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItinerary();
  }, [id, token, isAuthenticated]);

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Back Navigation */}
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => window.history.back()}
            style={{
              background: 'transparent',
              border: '2px solid var(--primary-blue, #3b82f6)',
              color: 'var(--primary-blue, #3b82f6)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--primary-blue, #3b82f6)';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--primary-blue, #3b82f6)';
            }}
          >
            ← Back to Profile
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="loading-state">
            <SkeletonLoader />
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>Loading itinerary...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <h2>Oops! Something went wrong</h2>
            <p className="error-message">❌ {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        ) : itinerary ? (
          <div className="itinerary-detail">
            <Itinerary itinerary={itinerary} />
          </div>
        ) : (
          <div className="error-state">
            <h2>No Data Found</h2>
            <p className="error-message">The itinerary data could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryDetailPage;
