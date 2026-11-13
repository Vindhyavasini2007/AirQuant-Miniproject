import React, { createContext, useContext, useState, useEffect } from 'react';
import { CityData, AlertRule } from '../types';
import { INDIAN_CITIES_DEMO, INITIAL_DEMO_ALERTS } from '../data/mockData';

interface CityContextType {
  selectedCity: CityData;
  setSelectedCity: (city: CityData) => void;
  setSelectedCityById: (id: string) => void;
  cities: CityData[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  alerts: AlertRule[];
  addAlert: (rule: Omit<AlertRule, 'id' | 'createdAt'>) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  comparisonCityIds: string[];
  setComparisonCityIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleComparisonCity: (id: string) => void;
  lastSyncTime: string;
  refreshDemoData: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cities] = useState<CityData[]>(INDIAN_CITIES_DEMO);
  
  // Default to Ghaziabad as requested
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return localStorage.getItem('airquant_selected_city') || 'ghaziabad';
  });

  const [searchQuery, setSearchQuery] = useState('');
  
  // Comparison cities
  const [comparisonCityIds, setComparisonCityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('airquant_compare_cities');
    return saved ? JSON.parse(saved) : ['ghaziabad', 'delhi', 'noida', 'mumbai', 'bengaluru'];
  });

  // Alerts with localStorage persistence
  const [alerts, setAlerts] = useState<AlertRule[]>(() => {
    const saved = localStorage.getItem('airquant_alerts');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_ALERTS;
  });

  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now (Demo Stream)');

  useEffect(() => {
    localStorage.setItem('airquant_selected_city', selectedCityId);
  }, [selectedCityId]);

  useEffect(() => {
    localStorage.setItem('airquant_compare_cities', JSON.stringify(comparisonCityIds));
  }, [comparisonCityIds]);

  useEffect(() => {
    localStorage.setItem('airquant_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const selectedCity = cities.find((c) => c.id === selectedCityId) || cities[0];

  const setSelectedCity = (city: CityData) => {
    setSelectedCityId(city.id);
  };

  const setSelectedCityById = (id: string) => {
    const found = cities.find((c) => c.id === id);
    if (found) {
      setSelectedCityId(id);
    }
  };

  const addAlert = (rule: Omit<AlertRule, 'id' | 'createdAt'>) => {
    const newAlert: AlertRule = {
      ...rule,
      id: `alt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleComparisonCity = (id: string) => {
    setComparisonCityIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev; // Keep at least 2 cities for comparison
        return prev.filter((c) => c !== id);
      } else {
        if (prev.length >= 6) return prev; // max 6
        return [...prev, id];
      }
    });
  };

  const refreshDemoData = () => {
    setLastSyncTime(`Updated ${new Date().toLocaleTimeString()} (Demo Sync)`);
  };

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        setSelectedCityById,
        cities,
        searchQuery,
        setSearchQuery,
        alerts,
        addAlert,
        toggleAlert,
        deleteAlert,
        comparisonCityIds,
        setComparisonCityIds,
        toggleComparisonCity,
        lastSyncTime,
        refreshDemoData,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};

