import { useState } from 'react';
import { isFunction, defaults } from '@tool-pack/basic';

const prefix = 'local-';
export function useLocalStorageState<T>(options: {
  storageKey: string;
  defaultValue: () => T;
  parser?: (value: string) => T;
  stringify?: (value: T) => string;
  onChange?: (value: T, prevValue: T | undefined) => void;
}): [T, (value: T) => void];
export function useLocalStorageState<T>(options: {
  storageKey: string;
  defaultValue: T;
  parser?: (value: string) => T;
  stringify?: (value: T) => string;
  onChange?: (value: T, prevValue: T | undefined) => void;
}): [T, (value: T) => void];
export function useLocalStorageState<T>({
  storageKey,
  defaultValue,
  parser = (value) => JSON.parse(value),
  stringify = (value) => JSON.stringify(value),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (): void => {},
}: {
  storageKey: string;
  defaultValue: T | (() => T);
  parser?: (value: string) => T;
  stringify?: (value: T) => string;
  onChange?: (value: T, prevValue: T | undefined) => void;
}): [T, (value: T) => void] {
  storageKey = prefix + storageKey;
  const [state, setState] = useState<T>(() => {
    const item = localStorage.getItem(storageKey);
    const dfv = isFunction(defaultValue) ? defaultValue() : defaultValue;
    const value = item !== null ? defaults(parser(item), dfv) : dfv;
    onChange(value, undefined);
    return value;
  });
  return [
    state,
    (value: T): void => {
      localStorage.setItem(storageKey, stringify(value));
      setState(value);
      onChange(value, state);
    },
  ];
}
