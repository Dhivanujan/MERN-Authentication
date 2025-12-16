import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, setAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token and user from backend on mount
  useEffect(() => {
    const initialiseAuth = async () => {
      try {
        // Try to refresh token first
        const response = await authAPI.refresh();
        const { token: newToken, user: userData } = response.data;
        
        setAccessToken(newToken);
        setToken(newToken);
        
        // If user data is returned from refresh, use it. Otherwise fetch it.
        if (userData) {
          setUser(userData);
        } else {
          const userResponse = await authAPI.getMe();
          setUser(userResponse.data.user);
        }
      } catch (err) {
        // Not authenticated or refresh failed
        setUser(null);
        setToken(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initialiseAuth();
  }, []);

  const register = async (username, email, password, profilePhoto) => {
    try {
      setError(null);
      const response = await authAPI.register({ username, email, password, profilePhoto });
      const { token: newToken, user: userData } = response.data;

      setAccessToken(newToken);
      setToken(newToken);
      setUser(userData);

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: userData } = response.data;

      setAccessToken(newToken);
      setToken(newToken);
      setUser(userData);

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      setToken(null);
      setAccessToken(null);
    }
  };

  const updateProfilePhoto = async (profilePhoto) => {
    try {
      setError(null);
      const response = await authAPI.updateProfilePhoto({ profilePhoto });

      const updatedUser = response.data.user;
      setUser(updatedUser);
      
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile photo';
      setError(message);
      throw new Error(message);
    }
  };

  const updateAccount = async ({ username, email, password }) => {
    try {
      setError(null);
      const payload = {};
      if (username !== undefined) payload.username = username.trim();
      if (email !== undefined) payload.email = email.trim();
      if (password) payload.password = password;

      const response = await authAPI.updateAccount(payload);
      const updatedUser = response.data.user;
      setUser(updatedUser);

      return updatedUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update account';
      setError(message);
      throw new Error(message);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfilePhoto,
    updateAccount,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
