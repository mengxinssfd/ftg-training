import { useLocalStorageState } from '@/hooks/useLocalStorageState';

export type Theme = 'light' | 'dark' | 'dark-transparent';
export const themes: Theme[] = ['light', 'dark', 'dark-transparent'];
export function useTheme(): [theme: Theme, setTheme: (theme: Theme) => void] {
  const [theme, setTheme] = useLocalStorageState<Theme>({
    storageKey: 'theme',
    defaultValue: 'light',
    onChange(theme): void {
      const prefix = 'theme-';
      document.body.classList.remove(...themes.map((t) => prefix + t));
      document.body.classList.add(prefix + theme);
    },
  });
  return [theme, setTheme];
}
