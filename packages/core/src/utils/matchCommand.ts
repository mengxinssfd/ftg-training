import { Direct } from '../enums';
import type { InputHistory } from '../types';
import { findIndexOfInputHistories } from './findIndexOfInputHistories';
import { transDirectByLocation } from './transDirectByLocation';

export function matchCommand(
  directs: Direct[],
  ih: InputHistory[],
  limitFrame: number,
  frame: number,
): boolean {
  let k = directs.length - 1;
  return (
    findIndexOfInputHistories(ih, limitFrame, frame, (h): boolean => {
      const d = transDirectByLocation(h.location, h.direct);
      if (directs[k] === d) k--;
      return k === -1;
    }) !== -1
  );
}
