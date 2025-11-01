import type { InputHistory as InputHistoryTS } from '@core';
import { Direct } from '@core';
import styles from './InputViewer.module.scss';
import { OtherKeys } from '@/common/OtherKeys';
import { getClassNames } from '@tool-pack/basic';
import { Arrow, None, Btn } from './InputHistory';
import type { ReactElement } from 'react';

const directs: { direct: Direct; el: ReactElement }[] = [
  { direct: Direct.UpLeft, el: <Arrow direct={Direct.UpLeft} /> },
  { direct: Direct.Up, el: <Arrow direct={Direct.Up} /> },
  { direct: Direct.UpRight, el: <Arrow direct={Direct.UpRight} /> },
  { direct: Direct.Left, el: <Arrow direct={Direct.Left} /> },
  { direct: Direct.None, el: <None /> },
  { direct: Direct.Right, el: <Arrow direct={Direct.Right} /> },
  { direct: Direct.DownLeft, el: <Arrow direct={Direct.DownLeft} /> },
  { direct: Direct.Down, el: <Arrow direct={Direct.Down} /> },
  { direct: Direct.DownRight, el: <Arrow direct={Direct.DownRight} /> },
];

const attacks = [
  { key: OtherKeys.LP, el: <Btn name={OtherKeys.LP} /> },
  { key: OtherKeys.MP, el: <Btn name={OtherKeys.MP} /> },
  { key: OtherKeys.HP, el: <Btn name={OtherKeys.HP} /> },
  { key: OtherKeys.LK, el: <Btn name={OtherKeys.LK} /> },
  { key: OtherKeys.MK, el: <Btn name={OtherKeys.MK} /> },
  { key: OtherKeys.HK, el: <Btn name={OtherKeys.HK} /> },
];

export function InputViewer({ inputHistories: ih }: { inputHistories: InputHistoryTS[] }) {
  const lastedInput = ih.at(-1);
  const activeDirectIcon = lastedInput ? lastedInput.direct : Direct.None;
  const activeAttacks = lastedInput ? lastedInput.others : [];
  return (
    <div className={styles['_']}>
      <ul className="directs">
        {directs.map((v) => (
          <li key={v.direct} className={getClassNames({ active: v.direct === activeDirectIcon })}>
            {v.el}
          </li>
        ))}
      </ul>
      <ul className="attacks">
        {attacks.map((v) => (
          <li key={v.key} className={getClassNames({ active: activeAttacks.includes(v.key) })}>
            {v.el}
          </li>
        ))}
      </ul>
    </div>
  );
}
