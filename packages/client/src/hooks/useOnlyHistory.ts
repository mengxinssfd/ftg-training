import { useEffect, useState } from 'react';

const storageKey = 'onlyHistory';
export function useOnlyHistory(): [onlyHistory: boolean, setOnlyHistory: (v: boolean) => void] {
  const [onlyHistory, setOnlyHistory] = useState(() => localStorage.getItem(storageKey) === '1');
  useEffect(() => {
    localStorage.setItem(storageKey, onlyHistory ? '1' : '0');
  }, [onlyHistory]);
  return [onlyHistory, setOnlyHistory];
}
