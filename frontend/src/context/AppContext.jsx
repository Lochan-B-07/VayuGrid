import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CITIES, DEFAULT_CITY } from '../constants/cities';
import { fetchCities, fetchActiveIncidents, fetchWeatherTelemetry, dispatchIncidentAction } from '../api/vayugridApi';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cities, setCities] = useState(CITIES);
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [incidents, setIncidents] = useState([]);
  const [activeIncident, setActiveIncident] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(false);
  const [toast, setToast] = useState(null);
  const [istTime, setIstTime] = useState('');

  // Live IST Clock update every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setIstTime(`${istString} IST`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show Toast
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, duration);
  }, []);

  // Initial load of cities
  useEffect(() => {
    let mounted = true;
    fetchCities().then(data => {
      if (mounted && data?.length) setCities(data);
    });
    return () => { mounted = false; };
  }, []);

  // Load incidents and weather when selectedCity changes
  const loadCityData = useCallback(async (city) => {
    if (!city) return;
    setIsLoadingIncidents(true);
    setActiveIncident(null); // Clear previous city's active incident immediately
    try {
      const cLat = city.center?.lat ?? 28.6139;
      const cLng = city.center?.lng ?? city.center?.lon ?? 77.2090;
      const [incidentList, weatherData] = await Promise.all([
        fetchActiveIncidents(city.id),
        fetchWeatherTelemetry(cLat, cLng),
      ]);
      setIncidents(incidentList);
      setWeather(weatherData);
      if (incidentList.length > 0) {
        setActiveIncident(incidentList[0]);
      } else {
        setActiveIncident(null);
      }
    } catch (err) {
      console.error('Error fetching city telemetry:', err);
      showToast('Telemetry refresh failed. Showing cached data.', 'warning');
    } finally {
      setIsLoadingIncidents(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCityData(selectedCity);
  }, [selectedCity, loadCityData]);

  // Handle City Change (accepts cityId string or city object)
  const handleSelectCity = useCallback((cityInput) => {
    if (!cityInput) return;
    const targetId = typeof cityInput === 'string' ? cityInput : cityInput?.id;
    const found = cities.find(
      c => c.id === targetId || (targetId === 'delhi' && c.id === 'delhi_ncr') || (targetId === 'delhi_ncr' && c.id === 'delhi')
    );
    if (found) {
      const normalizedCity = {
        ...found,
        id: found.id === 'delhi_ncr' ? 'delhi' : found.id,
        center: {
          lat: found.center?.lat ?? 28.6139,
          lng: found.center?.lng ?? found.center?.lon ?? 77.2090,
        },
      };
      setSelectedCity(normalizedCity);
    }
  }, [cities]);

  // Dispatch Action for an incident
  const handleDispatchAction = useCallback(async (ticketId, actionPayload) => {
    try {
      const result = await dispatchIncidentAction(ticketId, actionPayload);
      if (result.success || result.status === 'DISPATCHED') {
        // Update local state
        setIncidents(prev => prev.map(inc => {
          if (inc.ticket_id === ticketId) {
            return { ...inc, status: 'DISPATCHED' };
          }
          return inc;
        }));
        if (activeIncident?.ticket_id === ticketId) {
          setActiveIncident(prev => ({ ...prev, status: 'DISPATCHED' }));
        }
        showToast(`Asset Dispatched: ${result.asset_callsign || 'Anti-Smog Unit'} (ETA: ${result.eta_minutes || 12}m)`, 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast('Dispatch failed: ' + err.message, 'error');
      return false;
    }
  }, [activeIncident, showToast]);

  // Adapter: bridges { type, title, message } signature to showToast(message, type)
  const addToast = useCallback(({ type = 'info', title = '', message = '' } = {}) => {
    const text = message ? (title ? `${title}: ${message}` : message) : title;
    showToast(text || 'Notification', (type || 'info').toLowerCase());
  }, [showToast]);

  // Adapter: local status update for incidents
  const updateIncidentStatus = useCallback((ticketId, newStatus) => {
    setIncidents(prev => prev.map(inc =>
      inc.ticket_id === ticketId ? { ...inc, status: newStatus } : inc
    ));
    if (activeIncident?.ticket_id === ticketId) {
      setActiveIncident(prev => ({ ...prev, status: newStatus }));
    }
  }, [activeIncident]);

  const value = {
    cities,
    selectedCity,
    setSelectedCity: handleSelectCity,
    incidents,
    activeIncident,
    setActiveIncident,
    weather,
    isLoadingIncidents,
    refreshIncidents: () => loadCityData(selectedCity),
    dispatchAction: handleDispatchAction,
    updateIncidentStatus,
    toast,
    showToast,
    addToast,
    clearToast: () => setToast(null),
    istTime,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
