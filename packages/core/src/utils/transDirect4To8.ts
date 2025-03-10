import { Direct } from '@core';

/**
 * 把 4 方向的值转为 8 方向的值
 * @param directs
 */
export function transDirect4To8(directs: Set<Direct>): Direct {
  if (directs.has(Direct.Up)) {
    if (directs.has(Direct.Left)) return Direct.UpLeft;
    if (directs.has(Direct.Right)) return Direct.UpRight;
    return Direct.Up;
  }
  if (directs.has(Direct.Down)) {
    if (directs.has(Direct.Left)) return Direct.DownLeft;
    if (directs.has(Direct.Right)) return Direct.DownRight;
    return Direct.Down;
  }
  if (directs.has(Direct.Left)) return Direct.Left;
  if (directs.has(Direct.Right)) return Direct.Right;
  return Direct.None;
}
