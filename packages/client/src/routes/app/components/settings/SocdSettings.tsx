import style from './SocdSettings.module.scss';
import { Select } from 'antd';

export function SocdSettings({
  socd,
  onChange,
}: {
  socd: string;
  onChange: (socd: string) => void;
}) {
  return (
    <section className={style['_']}>
      <label>
        SOCD：
        <Select
          size="small"
          value={socd}
          onChange={onChange}
          options={[
            { value: 'socdN', label: '对向回中' },
            { value: 'socdFW', label: '前覆盖' },
            { value: 'socdLW', label: '后覆盖' },
          ]}></Select>
      </label>
    </section>
  );
}
