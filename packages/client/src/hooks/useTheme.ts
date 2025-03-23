import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'dark-transparent';
export const themes: Theme[] = ['light', 'dark', 'dark-transparent'];
const storageKey = 'page-theme';
export function useTheme(): [theme: Theme, setTheme: (theme: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme | null) || 'light',
  );
  useEffect(() => {
    updateThemeToBody(theme);
  }, [theme]);
  return [theme, setTheme];
  function updateThemeToBody(theme: Theme): void {
    const prefix = 'theme-';
    document.body.classList.remove(...themes.map((t) => prefix + t));
    document.body.classList.add(prefix + theme);
    localStorage.setItem(storageKey, theme);
  }
}
