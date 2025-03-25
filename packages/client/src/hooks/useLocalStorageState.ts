import { useState } from 'react';

const prefix = 'local-';
export function useLocalStorageState<T>({
  storageKey,
  defaultValue,
  parser = (value) => JSON.parse(value),
  stringify = (value) => JSON.stringify(value),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (): void => {},
}: {
  storageKey: string;
  defaultValue: T;
  parser?: (value: string) => T;
  stringify?: (value: T) => string;
  onChange?: (value: T) => void;
}): [T, (value: T) => void] {
  storageKey = prefix + storageKey;
  const [state, setState] = useState<T>(() => {
    const item = localStorage.getItem(storageKey);
    let value = defaultValue;
    if (item !== null) value = parser(item);
    onChange(value);
    return value;
  });
  return [
    state,
    (value: T): void => {
      setState(value);
      localStorage.setItem(storageKey, stringify(value));
      onChange(value);
    },
  ];
}
