import type { InputHistory as InputHistoryTS } from '@core';
import { Direct } from '@core';
import styles from './InputViewer.module.scss';
import { iconMap } from '@/common/iconMap';
import { OtherKeys } from '@/common/OtherKeys';
import { getClassNames } from '@tool-pack/basic';

const directs = [
  iconMap[Direct.UpLeft],
  iconMap[Direct.Up],
  iconMap[Direct.UpRight],
  iconMap[Direct.Left],
  iconMap[Direct.None],
  iconMap[Direct.Right],
  iconMap[Direct.DownLeft],
  iconMap[Direct.Down],
  iconMap[Direct.DownRight],
];

const attacks = [
  OtherKeys.LP,
  OtherKeys.MP,
  OtherKeys.HP,
  OtherKeys.LK,
  OtherKeys.MK,
  OtherKeys.HK,
];

export function InputViewer({ inputHistories: ih }: { inputHistories: InputHistoryTS[] }) {
  const lastedInput = ih.at(-1);
  const activeDirectIcon = iconMap[lastedInput ? lastedInput.direct : Direct.None];
  const activeAttacks = lastedInput ? lastedInput.others : [];
  return (
    <div className={styles['_']}>
      <ul className="directs">
        {directs.map((v) => (
          <li key={v} className={getClassNames({ active: v === activeDirectIcon })}>
            {v}
          </li>
        ))}
      </ul>
      <ul className="attacks">
        {attacks.map((v) => (
          <li key={v} className={getClassNames({ active: activeAttacks.includes(v) })}>
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
}
