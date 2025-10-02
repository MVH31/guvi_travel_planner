import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const AuthExample = () => {
  const { 
    user, 
    isLoading, 
    login, 
    register, 
    logout, 
    isAuthenticated,
    getCurrentUser 
  } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      let result;
      if (isLoginMode) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        setMessage(`${isLoginMode ? 'Login' : 'Registration'} successful!`);
        setFormData({ name: '', email: '', password: '' });
      } else {
        setMessage(result.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
    }
  };

  const handleLogout = () => {
    const result = logout();
    if (result.success) {
      setMessage('Logged out successfully');
    }
  };

  const handleGetCurrentUser = async () => {
    const result = await getCurrentUser();
    if (result.success) {
      setMessage('User profile refreshed');
    } else {
      setMessage(result.error || 'Failed to get user profile');
    }
  };

  if (isAuthenticated()) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Welcome, {user?.name}!</h2>
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Member since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={handleGetCurrentUser} 
            disabled={isLoading}
            style={{ marginRight: '10px' }}
          >
            {isLoading ? 'Loading...' : 'Refresh Profile'}
          </button>
          
          <button 
            onClick={handleLogout}
            disabled={isLoading}
            style={{ backgroundColor: '#dc3545', color: 'white' }}
          >
            Logout
          </button>
        </div>
        
        {message && (
          <p style={{ 
            color: message.includes('error') || message.includes('Failed') ? 'red' : 'green' 
          }}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
      
      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
          <div style={{ marginBottom: '15px' }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required={!isLoginMode}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        >
          {isLoading ? 'Loading...' : (isLoginMode ? 'Login' : 'Register')}
        </button>
      </form>
      
      <p>
        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setMessage('');
            setFormData({ name: '', email: '', password: '' });
          }}
          style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {isLoginMode ? 'Register' : 'Login'}
        </button>
      </p>
      
      {message && (
        <p style={{ 
          color: message.includes('error') || message.includes('Failed') ? 'red' : 'green' 
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AuthExample;