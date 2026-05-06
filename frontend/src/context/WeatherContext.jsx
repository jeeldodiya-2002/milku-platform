import React, { createContext, useState, useContext, useEffect } from 'react';
import { MASTER_CONFIG } from '../masterConfig';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState({
    temp: MASTER_CONFIG.WEATHER.DEFAULT_TEMP,
    condition: 'Clear',
    loading: true
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { lat, lon } = MASTER_CONFIG.WEATHER.FALLBACK_COORDINATES;
        const key = MASTER_CONFIG.WEATHER.API_KEY;
        const res = await fetch(`${MASTER_CONFIG.WEATHER.API_ENDPOINT}?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
        const data = await res.json();
        
        if (data.main) {
          setWeather({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
            loading: false
          });
        } else {
          throw new Error("Invalid weather data");
        }
      } catch (err) {
        console.warn("Weather fetch failed, using cinematic defaults");
        setWeather({
          temp: MASTER_CONFIG.WEATHER.DEFAULT_TEMP,
          condition: 'Clear',
          loading: false
        });
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, MASTER_CONFIG.WEATHER.CACHE_DURATION_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <WeatherContext.Provider value={weather}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
