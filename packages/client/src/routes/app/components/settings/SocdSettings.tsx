import style from './SocdSettings.module.scss';
import type { SOCD } from '@core';
import { socdN, socdLW, socdFW } from '@core';
import { Select } from 'antd';

export function SocdSettings({ onChange }: { onChange: (socd: SOCD) => void }) {
  return (
    <section className={style['_']}>
      <label>
        SOCD：
        <Select
          size="small"
          defaultValue="socdN"
          onChange={(v) => {
            const map = { socdN, socdLW, socdFW };
            onChange(map[v as keyof typeof map]);
          }}
          options={[
            { value: 'socdN', label: '对向回中' },
            { value: 'socdFW', label: '前覆盖' },
            { value: 'socdLW', label: '后覆盖' },
          ]}></Select>
      </label>
    </section>
  );
}
