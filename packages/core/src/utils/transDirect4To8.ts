import { Direct } from '@core';

/**
 * 将四向方向组合转换为八向方向
 *
 * @param {Set<Direct>} directs - 包含基础方向的集合（上、下、左、右）
 * @returns {Direct} 返回转换后的八向方向值
 *
 * @description
 * 该函数用于将多个四向输入组合转换为对应的八向输入。
 * 转换规则如下：
 * - 上 + 左 = 左上
 * - 上 + 右 = 右上
 * - 下 + 左 = 左下
 * - 下 + 右 = 右下
 * - 单独的上、下、左、右保持不变
 * - 无输入时返回 None
 *
 * 优先级顺序：
 * 1. 上方向组合（左上、右上）
 * 2. 下方向组合（左下、右下）
 * 3. 单一方向（左、右）
 * 4. 无方向
 *
 * @example
 * // 同时输入上和右
 * const directs = new Set([Direct.Up, Direct.Right]);
 * const result = transDirect4To8(directs);
 * // 返回 Direct.UpRight
 *
 * // 单一方向输入
 * const singleDirect = new Set([Direct.Left]);
 * const result2 = transDirect4To8(singleDirect);
 * // 返回 Direct.Left
 *
 * // 无输入
 * const emptyDirect = new Set();
 * const result3 = transDirect4To8(emptyDirect);
 * // 返回 Direct.None
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
