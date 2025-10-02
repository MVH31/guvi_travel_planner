import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } finally {
        setInitialLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Helper function to make API requests
  const makeApiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Something went wrong');
    }

    return data;
  };

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await makeApiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Backend returns { message, token, user } on success
      const { token: newToken, user: userData } = data;
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      // Save to localStorage
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await makeApiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      // Backend returns { message, token, user } on success
      const { token: newToken, user: userData } = data;
      
      setToken(newToken);
      setUser(userData);
      
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setIsLoading(true);
    try {
      // Clear state
      setUser(null);
      setToken(null);
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Get current user profile (useful for refreshing user data)
  const getCurrentUser = async () => {
    if (!token) {
      return { success: false, error: 'No token available' };
    }

    setIsLoading(true);
    try {
      const data = await makeApiRequest('/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (data.success) {
        const userData = data.user;
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        throw new Error(data.message || 'Failed to get user profile');
      }
    } catch (error) {
      console.error('Get current user error:', error);
      
      // If token is invalid, logout user
      if (error.message.includes('token') || error.message.includes('Access denied')) {
        logout();
      }
      
      return { 
        success: false, 
        error: error.message || 'Failed to get user profile' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(token && user);
  };

  // Context value
  const value = {
    // State
    user,
    token,
    isLoading,
    initialLoading,
    
    // Functions
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    
    // Helper
    API_BASE_URL,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;