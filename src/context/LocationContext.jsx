import React, { createContext, useContext, useMemo, useState } from 'react';
import { generateMockData } from '../data/mockData';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [demoProfileId, setDemoProfileId] = useState(() => localStorage.getItem('genyx.demoProfile') || 'midMarket');
  const [country, setCountry] = useState('India');

  const data = useMemo(() => generateMockData({ profileId: demoProfileId, country, seed: 'genyx-crm' }), [country, demoProfileId]);

  const allLocations = useMemo(() => [data.facility], [data.facility]);
  const [currentLocation, setCurrentLocation] = useState(allLocations[0]);

  // keep currentLocation in sync when profile regenerates
  React.useEffect(() => {
    setCurrentLocation(allLocations[0]);
  }, [allLocations]);

  const setLocation = (locationId) => {
    const loc = allLocations.find(l => l.id === locationId);
    if (loc) {
      setCurrentLocation(loc);
    }
  };

  const setDemoProfile = (id) => {
    setDemoProfileId(id);
    localStorage.setItem('genyx.demoProfile', id);
  };

  return (
    <LocationContext.Provider value={{
      currentLocation,
      allLocations,
      setLocation,
      demoProfileId,
      setDemoProfile,
      locale: data.locale,
      currency: data.currency,
      dataset: data,
      setCountry,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
