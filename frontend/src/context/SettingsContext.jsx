import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // HIGH-SPEED DEFAULTS: The "Safety Net" for 0ms load time
  const [settings, setSettings] = useState({
    whatsappNumber: '918347711123',
    email: 'gdproduct3@gmail.com',
    address: '22-A, Parmanand Industrial Society, Near Kharvarnagar BRTS Junction, U-M Road, Khatodara, Surat-395002',
    fssaiNumber: '10719014000677',
    mapEmbedUrl: '',
    googleMapsLink: 'https://maps.app.goo.gl/8pdAN8voMJFbgXNg8',
    branches: []
  });
  
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res && res.data && res.data.success) {
        setSettings(res.data.data);
      }
    } catch (err) {
       if (import.meta.env.DEV) console.warn("Using default settings; backend unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        const sorted = res.data.data.sort((a, b) => {
          const getName = (cat) => (cat.name || '').toLowerCase().trim();
          const nameA = getName(a);
          const nameB = getName(b);

          const getRank = (cat) => {
            const name = getName(cat);
            if (name === 'other items') return 3;
            if (name === 'special items') return 2;
            if (cat.isMain) return 0;
            return 1;
          };

          const rankA = getRank(a);
          const rankB = getRank(b);

          if (rankA !== rankB) {
            return rankA - rankB;
          }

          // If same rank, sort alphabetically
          return nameA.localeCompare(nameB);
        });
        setCategories(sorted);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchSettings();
    fetchCategories();

    // REAL-TIME SYNC: Initialize Socket.io connection
    const socketBaseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : `${window.location.protocol}//${window.location.hostname}:5000`;
      
    const socket = io(socketBaseUrl);

    socket.on('settings_updated', (updatedSettings) => {
      if (import.meta.env.DEV) console.log("✨ Settings synchronized in real-time");
      setSettings(updatedSettings);
    });
    
    socket.on('categories_updated', () => {
      if (import.meta.env.DEV) console.log("✨ Categories synchronized in real-time");
      fetchCategories();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getWhatsAppLink = (message) => {
    // SANITIZE: Ensure the number is always pure digits (removes + and spaces)
    const cleanNumber = String(settings.whatsappNumber).replace(/\D/g, '');
    const finalMsg = message || settings.defaultWhatsAppMessage || "Hi, I want to enquire about Milku products.";
    const encodedMsg = encodeURIComponent(finalMsg);
    return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      loading, 
      categories, 
      getWhatsAppLink, 
      refreshSettings: fetchSettings,
      refreshCategories: fetchCategories 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
