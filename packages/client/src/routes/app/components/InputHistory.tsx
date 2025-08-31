import type { InputHistory as InputHistoryTS } from '@core';
import styles from './InputHistory.module.scss';
import { iconMap } from '@/common/iconMap';
import { getClassNames } from '@tool-pack/basic';

export function InputHistory({
  inputHistories: ih,
  frame: currentFrame,
  lay,
}: {
  inputHistories: InputHistoryTS[];
  frame: number;
  lay: 'vertical' | 'horizontal';
}) {
  return (
    <ul
      className={getClassNames(
        styles['_'],
        lay === 'horizontal' ? styles['horizontal'] : styles['vertical'],
      )}>
      {ih
        .slice(-50)
        .map((v, i, arr) => {
          const lastV = arr[i + 1];
          const frame = Math.min(99, (lastV ? lastV.startFrame : currentFrame) - v.startFrame);
          return (
            <li key={v.startFrame}>
              <div className="frame">{frame}</div>
              <div className="direct">{iconMap[v.direct]}</div>
              <div className="attacks">
                {v.others.map((o) => (
                  <span key={o} className={o as string}>
                    {o}
                  </span>
                ))}
              </div>
            </li>
          );
        })
        .reverse()}
    </ul>
  );
}
