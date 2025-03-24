import style from './LocationSettings.module.scss';
import { PlayerLocation } from '@core';
import { Select } from 'antd';

export function LocationSettings({
  location,
  onChange,
}: {
  location: PlayerLocation;
  onChange: (location: PlayerLocation) => void;
}): JSX.Element {
  return (
    <section className={style['_']}>
      <label>
        站位：
        <Select
          size="small"
          value={location}
          onChange={(v) => onChange(v)}
          options={[
            { value: PlayerLocation.Left, label: '1P' },
            { value: PlayerLocation.Right, label: '2P' },
          ]}></Select>
      </label>
    </section>
  );
}
