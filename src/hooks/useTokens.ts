import { useState, useEffect } from 'react';

const STORAGE_KEY = 'weblozy_token_usage';
const TOTAL_LIMIT = 50000;

export function useTokens() {
  const [used, setUsed] = useState(0);
  const [lastUsage, setLastUsage] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUsed(parseInt(stored));
    } else {
      // Initial dummy usage for realism
      const initial = Math.floor(Math.random() * 5000) + 2000;
      setUsed(initial);
      localStorage.setItem(STORAGE_KEY, initial.toString());
    }
  }, []);

  const consumeTokens = (count: number) => {
    setUsed(prev => {
      const next = prev + count;
      localStorage.setItem(STORAGE_KEY, next.toString());
      return next;
    });
    setLastUsage(count);
  };

  const remaining = TOTAL_LIMIT - used;
  const percentage = (used / TOTAL_LIMIT) * 100;

  return {
    used,
    remaining,
    total: TOTAL_LIMIT,
    percentage,
    lastUsage,
    consumeTokens
  };
}
