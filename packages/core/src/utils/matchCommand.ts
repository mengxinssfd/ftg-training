import { Direct } from '../enums';
import type { InputHistory } from '../types';
import { findIndexOfInputHistories } from './findIndexOfInputHistories';
import { transDirectByLocation } from './transDirectByLocation';

/**
 * 检查输入历史记录是否匹配指定的命令序列
 *
 * @param {Direct[]} directs - 需要匹配的方向命令数组，按顺序存储
 * @param {InputHistory[]} ih - 输入历史记录数组
 * @param {number} limitFrame - 输入检测的帧数限制，用于限制检测的时间范围
 * @param {number} frame - 当前帧数，用于计算时间差
 * @returns {boolean} 如果输入历史完全匹配命令序列返回 true，否则返回 false
 *
 * @description
 * 该函数用于检查玩家的输入历史是否匹配特定的命令序列。它从后向前遍历命令序列，
 * 并在限定的帧数范围内查找匹配的输入。考虑了输入位置对方向的影响（通过 transDirectByLocation 转换）。
 *
 * @example
 * const directions = [Direct.Down, Direct.Right, Direct.Up]; // 假设的命令序列
 * const inputHistory = [...]; // 输入历史记录
 * const isMatched = matchCommand(directions, inputHistory, 60, currentFrame);
 */
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
