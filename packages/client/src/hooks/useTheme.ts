import { useEffect } from 'react';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

export type Theme = 'light' | 'dark' | 'dark-transparent';
export const themes: Theme[] = ['light', 'dark', 'dark-transparent'];
export function useTheme(): [theme: Theme, setTheme: (theme: Theme) => void] {
  const [theme, setTheme] = useLocalStorageState<Theme>('theme', 'light');
  useEffect(() => {
    const prefix = 'theme-';
    document.body.classList.remove(...themes.map((t) => prefix + t));
    document.body.classList.add(prefix + theme);
  }, [theme]);
  return [theme, setTheme];
}
