import { Directs } from '@core';

/**
 * 把 4 方向的值转为 8 方向的值
 * @param directs
 */
export function transDirect4To8(directs: Set<Directs>): Directs {
  if (directs.has(Directs.Up)) {
    if (directs.has(Directs.Left)) return Directs.UpLeft;
    if (directs.has(Directs.Right)) return Directs.UpRight;
    return Directs.Up;
  }
  if (directs.has(Directs.Down)) {
    if (directs.has(Directs.Left)) return Directs.DownLeft;
    if (directs.has(Directs.Right)) return Directs.DownRight;
    return Directs.Down;
  }
  if (directs.has(Directs.Left)) return Directs.Left;
  if (directs.has(Directs.Right)) return Directs.Right;
  return Directs.None;
}
