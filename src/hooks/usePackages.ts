import { useState, useEffect, useCallback } from 'react';
import { Package } from '../types';
import { generatePackages, movePackages } from '../utils/mockData';

export function usePackages(refreshInterval = 3000) {
  const [packages, setPackages] = useState<Package[]>(() => generatePackages(20));

  const refresh = useCallback(() => {
    setPackages((prev) => movePackages(prev));
  }, []);

  useEffect(() => {
    const timer = setInterval(refresh, refreshInterval);
    return () => clearInterval(timer);
  }, [refresh, refreshInterval]);

  return { packages, refresh };
}
