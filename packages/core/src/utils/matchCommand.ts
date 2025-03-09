import { Directs } from '../enums';
import type { InputHistory } from '../types';
import { transDirectByLocation } from './transDirectByLocation';

export function matchCommand(
  directs: Directs[],
  ih: InputHistory[],
  limitFrame: number,
  frame: number,
): boolean {
  if (!ih.length) return false;
  let k = directs.length - 1;
  for (let i = ih.length - 1; i >= 0; i--) {
    const h = ih[i] as InputHistory;
    if (frame - h.startFrame > limitFrame) return false;
    const d = transDirectByLocation(h.location, h.direct);
    if (directs[k] === d) k--;
    if (k === -1) return true;
  }
  return false;
}
