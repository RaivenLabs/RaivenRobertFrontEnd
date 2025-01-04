// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/auth/check-session');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          // In development, we'll default to not authenticated
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // Handle network errors or missing endpoint gracefully
        console.log('Auth check failed, defaulting to unauthenticated state');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async () => {
    // For development, we can set a mock authenticated state
    setIsAuthenticated(true);
    setUser({
      customerId: 'LAW001', // Example customer ID
      customerType: 'law_firm'
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return <div>Loading authentication...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
