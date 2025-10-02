import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ItineraryPlanner from './components/ItineraryPlanner'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ItineraryDetailPage from './pages/ItineraryDetailPage'

function App() {
  const { initialLoading } = useAuth()

  // Show loading screen during initial auth check
  if (initialLoading) {
    return (
      <div className="app-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center' 
      }}>
        <div>
          <h2>Loading...</h2>
          <p>Please wait while we initialize the app...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<ItineraryPlanner />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/itinerary/:id" element={
          <ProtectedRoute>
            <ItineraryDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  )
}

export default App