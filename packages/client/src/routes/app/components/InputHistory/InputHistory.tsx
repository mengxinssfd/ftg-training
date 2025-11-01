import type { InputHistory as InputHistoryTS } from '@core';
import { Direct } from '@core';
import styles from './InputHistory.module.scss';
import { getClassNames } from '@tool-pack/basic';
import type { CSSProperties } from 'react';
import { Arrow } from './Arrow';
import { None } from './None';
import { Btn } from './Btn';

export function InputHistory({
  inputHistories: ih,
  frame: currentFrame,
  fontSize = DefaultInputHistoryFontSize,
  lay,
}: {
  inputHistories: InputHistoryTS[];
  frame: number;
  lay: 'vertical' | 'horizontal';
  fontSize: number;
}) {
  return (
    <ul
      style={{ ['--ih-fs' as keyof CSSProperties]: fontSize + 'px' }}
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
              <div className="direct">
                {v.direct === Direct.None ? <None /> : <Arrow direct={v.direct} />}
              </div>
              <div className="attacks">
                {v.others.map((o) => (
                  <Btn key={o} name={o as string} />
                ))}
              </div>
            </li>
          );
        })
        .reverse()}
    </ul>
  );
}

export const DefaultInputHistoryFontSize = 16;
