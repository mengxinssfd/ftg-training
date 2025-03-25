import { Select } from 'antd';

export type Theme = 'light' | 'dark' | 'dark-transparent';
export const themes: Theme[] = ['light', 'dark', 'dark-transparent'];
export function ThemeSettings({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) {
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
}
