import type { InputHistory } from '../types';

export function findIndexOfInputHistories(
  ih: InputHistory[],
  limitFrame: number,
  frame: number,
  handler: (history: InputHistory) => boolean,
): number {
  if (!ih.length) return -1;
  for (let i = ih.length - 1; i >= 0; i--) {
    const h = ih[i] as InputHistory;
    if (handler(h)) return i;
    // 最后才检查超帧，因为有帧是连续的，如果能匹配上的话只会算最后指令的 1 帧
    if (frame - h.startFrame > limitFrame) return -1;
  }
  return -1;
}
