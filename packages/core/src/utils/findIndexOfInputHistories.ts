import type { InputHistory } from '../types';
/**
 * 在给定的帧数限制内，通过条件处理函数查找第一个匹配的输入历史记录的索引。
 *
 * @param {InputHistory[]} ih - 需要搜索的输入历史记录数组
 * @param {number} limitFrame - 匹配时考虑的最大帧数限制
 * @param {number} frame - 用于计算帧差值的当前帧
 * @param {function} handler - 回调函数，接收一个 `InputHistory` 对象并返回一个布尔值，表示是否符合所需条件
 * @return {number} 返回匹配的输入历史记录的索引，如果未找到匹配项或超出帧数限制则返回 -1
 */
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
