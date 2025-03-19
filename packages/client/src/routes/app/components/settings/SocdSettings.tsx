import style from './SocdSettings.module.scss';
import type { SOCD } from '@core';
import { socdN, socdLW, socdFW } from '@core';

export function SocdSettings({ onChange }: { onChange: (socd: SOCD) => void }) {
  return (
    <section className={style['_']}>
      <label>
        SOCD：
        <select
          name="socd"
          onChange={(e) => {
            const map = { socdN, socdLW, socdFW };
            onChange(map[e.target.value as keyof typeof map]);
          }}
          defaultValue="socdN">
          <option value="socdN">对向回中</option>
          <option value="socdFW">前覆盖</option>
          <option value="socdLW">后覆盖</option>
        </select>
      </label>
    </section>
  );
}
