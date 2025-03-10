import type { InputHistory as InputHistoryTS } from '@core';
import styles from './InputHistory.module.scss';
import { iconMap } from '@/common/iconMap';

export function InputHistory({
  inputHistories: ih,
  frame: currentFrame,
}: {
  inputHistories: InputHistoryTS[];
  frame: number;
}) {
  return (
    <ul className={styles['_']}>
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
