import { useEffect, useState } from 'react';
import { Select } from 'antd';

type Theme = 'light' | 'dark';
const themes: Theme[] = ['light', 'dark'];
const storageKey = 'page-theme';
export function ThemeSettings() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme | null) || 'light',
  );
  useEffect(() => {
    updateThemeToBody(theme);
  }, [theme]);
  return (
    <section>
      <label>
        主题：
        <Select
          size="small"
          value={theme}
          onChange={(v) => setTheme(v as Theme)}
          options={themes.map((t) => ({ value: t, label: t }))}
        />
      </label>
    </section>
  );
  function updateThemeToBody(theme: Theme): void {
    const prefix = 'theme-';
    document.body.classList.remove(...themes.map((t) => prefix + t));
    document.body.classList.add(prefix + theme);
    localStorage.setItem(storageKey, theme);
  }
}
