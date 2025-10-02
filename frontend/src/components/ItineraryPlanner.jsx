import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Itinerary from './Itinerary'
import { Navigate } from 'react-router-dom'
import SkeletonLoader from './SkeletonLoader.jsx'

const ItineraryPlanner = () => {
  const { user, token, isAuthenticated } = useAuth()
  const [query, setQuery] = useState('')
  const [itinerary, setItinerary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking', 'online', 'offline'
  const [error, setError] = useState(null)

  // Check backend status on component mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health')
        if (response.ok) {
          setBackendStatus('online')
          console.log('✅ Backend is online and ready')
        } else {
          setBackendStatus('offline')
          console.log('❌ Backend responded but with error')
        }
      } catch (error) {
        setBackendStatus('offline')
        console.log('❌ Backend is offline or not responding')
      }
    }

    checkBackendStatus()
  }, [])

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = async () => {
    // Check if token exists for authentication
    if (!token) {
      setError("❌ Authentication token not found. Please log in again.")
      return
    }

    if (!query) {
      alert("Please enter a trip description.")
      return
    }

    setIsLoading(true)
    setItinerary(null)

    try {
      // First, test if backend is running
      setError(null);
      console.log('🔄 Testing backend connection...')
      const healthResponse = await fetch('http://localhost:3001/api/health')
      
      if (!healthResponse.ok) {
        throw new Error(`Backend server is not responding. Health check failed: ${healthResponse.status}`)
      }
      
      console.log('✅ Backend is running, generating itinerary...')
      
      const response = await fetch('http://localhost:3001/api/itinerary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ query: query })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend error:', errorText)
        throw new Error(`Network response was not OK! Status:${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('✅ Itinerary generated successfully:', data)
      setItinerary(data)
    } catch (error) { 
        console.error("Error fetching itinerary:", error)
        
        if (error.message.includes('fetch')) {
          setError("❌ Cannot connect to the backend server. Please make sure the backend is running on http://localhost:3001")
        } else if (error.message.includes('Health check failed')) {
          setError("❌ Backend server is not responding. Please check if it's running properly.")
        } else {
          setError(`❌ Error generating itinerary: ${error.message}`)
        }
    } finally {
      setIsLoading(false) 
    }
  }

  return (
    <div className="itinerary-planner">
      <div className="container" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>
        
        {/* Backend Status Indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '20px' 
        }}>
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: backendStatus === 'online' ? '#d4edda' : backendStatus === 'offline' ? '#f8d7da' : '#fff3cd',
            color: backendStatus === 'online' ? '#155724' : backendStatus === 'offline' ? '#721c24' : '#856404',
            border: `1px solid ${backendStatus === 'online' ? '#c3e6cb' : backendStatus === 'offline' ? '#f5c6cb' : '#ffeaa7'}`
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: backendStatus === 'online' ? '#28a745' : backendStatus === 'offline' ? '#dc3545' : '#ffc107'
            }}></span>
            Backend Server: {backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}
          </div>
        </div>

        {/* Header Section */}
        <div className="hero-section" style={{ 
          textAlign: 'center', 
          marginBottom: '50px' 
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: '#333', 
            marginBottom: '15px',
            fontWeight: '700'
          }}>
            Travel Itinerary Generator
          </h1>
          <p className="subtitle" style={{ 
            fontSize: '1.2rem', 
            color: '#666', 
            marginBottom: '0' 
          }}>
            Welcome back, {user?.name}! Describe your dream trip, and let us handle the planning!
          </p>
        </div>

        {/* Input Section */}
        <div className="input-section" style={{ 
          maxWidth: '800px', 
          margin: '0 auto 40px auto' 
        }}>
          <textarea
            className="query-box"
            placeholder='e.g., A 5-day cultural trip to Rajasthan for a family of four, including visits to historical sites, local markets, and traditional cuisine experiences.'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '20px',
              fontSize: '1rem',
              border: '2px solid #e1e5e9',
              borderRadius: '12px',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              marginBottom: '20px'
            }}
          />
          
          <div style={{ textAlign: 'center' }}>
            <button 
              className="generate-button"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, var(--primary-blue, #3b82f6), var(--primary-blue-hover, #2563eb))',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                fontSize: '1.1rem',
                fontWeight: '600',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? 'Generating...' : 'Generate Itinerary'}
            </button>
          </div>
        </div>
        
        {error && error.trim() && <div className="error-message">{error}</div>}

        {/* Results Section */}
        <div className='itinerary-section'>
          {isLoading && <SkeletonLoader />}
          {!isLoading && itinerary && <Itinerary itinerary={itinerary} />}
        </div>

      </div>
    </div>
  )
}

export default ItineraryPlanner