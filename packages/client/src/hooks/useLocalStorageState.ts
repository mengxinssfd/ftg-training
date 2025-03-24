import { useState } from 'react';

const prefix = 'local-';
export function useLocalStorageState<T>(
  storageKey: string,
  defaultValue: T,
  parser = (value: string): T => JSON.parse(value),
  stringify = (value: T): string => JSON.stringify(value),
): [T, (value: T) => void] {
  storageKey = prefix + storageKey;
  const [state, setState] = useState<T>(() => {
    const item = localStorage.getItem(storageKey);
    if (item === null) return defaultValue;
    return parser(item);
  });
  return [
    state,
    (value: T): void => {
      setState(value);
      localStorage.setItem(storageKey, stringify(value));
    },
  ];
}
