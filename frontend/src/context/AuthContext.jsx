import React, { createContext, useState, useContext, useEffect } from 'react';
import { verifyDevice } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      const deviceToken = localStorage.getItem('milku_device_token');
      const token = localStorage.getItem('milku_admin_token');
      
      if (deviceToken && token) {
        try {
          const res = await verifyDevice();
          if (res.data.success) {
            localStorage.setItem('milku_admin_token', res.data.token); // Refresh token
            setIsAdmin(true);
          }
        } catch (err) {
          console.error("Auto-login failed:", err);
          if (err.response?.status === 401) {
            handleLogout();
          }
        }
      }
      setLoading(false);
    };

    autoLogin();
  }, []);

  const handleLogin = (token, deviceToken) => {
    localStorage.setItem('milku_admin_token', token);
    localStorage.setItem('milku_device_token', deviceToken);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('milku_admin_token');
    localStorage.removeItem('milku_device_token');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
