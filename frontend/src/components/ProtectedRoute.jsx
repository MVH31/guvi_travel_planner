import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated } = useAuth();

  if (!token || !isAuthenticated()) {
    // If no token or not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the children components
  return children;
};

export default ProtectedRoute;