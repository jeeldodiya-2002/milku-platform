import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Always English
  const [language] = useState('en');

  const toggleLanguage = () => {
    // No-op in English-only mode
  };

  const updateLanguage = (lang) => {
    // No-op
  };

  const t = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    // Return English if it exists, otherwise the value itself if it's not a translation object
    return obj['en'] || (typeof obj === 'object' ? Object.values(obj)[0] : obj) || '';
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage: updateLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
