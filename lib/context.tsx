import { createContext, useContext, useMemo, useState } from 'react';

export const AppContext = createContext({});

export default function Provider({ children }: any) {
  const [filters, setFilters] = useState({});
  const [seedTracks, setSeedTracks] = useState([]);

  const value = useMemo(() => {
    return { filters, seedTracks };
  }, [filters, seedTracks]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
