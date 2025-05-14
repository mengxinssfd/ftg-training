import { Direct } from '@core';
import { getAngle, getDistance } from '@tool-pack/basic';

/**
 * 将坐标轴输入值解析为方向指令
 *
 * @param {[number, number]} param0 - 输入的坐标轴值，[x, y] 坐标
 * @param {number} [deadZone=0.005] - 死区值，小于该值的输入将被视为无输入，默认为 0.005
 * @returns {Direct[]} 返回解析后的方向指令数组
 *
 * @description
 * 该函数将二维坐标输入（如摇杆输入）转换为 8 个方向的指令。
 * 转换规则如下：
 * - 当输入值在死区范围内时，返回 [Direct.None]
 * - 将 360 度平均分为 8 个方向，每个方向占据 45 度角
 * - 每个方向的判定范围是以其正方位为中心，前后各 22.5 度
 * - 斜向输入会被解析为两个相邻方向的组合（如右上、左下等）
 *
 * 方向角度对应关系：
 * - 0度：上
 * - 45度：右上
 * - 90度：右
 * - 135度：右下
 * - 180度：下
 * - 225度：左下
 * - 270度：左
 * - 315度：左上
 *
 * @example
 * // 向右下方输入
 * const directs = parserDirectsFromAxes([0.7, 0.7]);
 * // 返回 [Direct.Down, Direct.Right]
 *
 * // 在死区范围内的输入
 * const noInput = parserDirectsFromAxes([0.001, 0.001]);
 * // 返回 [Direct.None]
 */
export function parserDirectsFromAxes([x, y]: [x: number, y: number], deadZone = 0.005): Direct[] {
  // 如果输入的数值小于死区则判定为未输入
  // if (axes.every((v) => Math.abs(v) < deadZone)) return [Direct.None];
  if (getDistance([0, 0], [x, y]) < deadZone) return [Direct.None];

  // 8 向的话 360 / 8 就是每个方位占据 45 度角
  const unit = 45;
  // 以正方位前后减去 45 的一半也就是 22.5 度角
  const halfUnit = 22.5;
  const matches: [range: number, direct: Direct[]][] = [
    [halfUnit, [Direct.Up]],
    [halfUnit + unit, [Direct.Up, Direct.Right]],
    [halfUnit + unit * 2, [Direct.Right]],
    [halfUnit + unit * 3, [Direct.Right, Direct.Down]],
    [halfUnit + unit * 4, [Direct.Down]],
    [halfUnit + unit * 5, [Direct.Down, Direct.Left]],
    [halfUnit + unit * 6, [Direct.Left]],
    [halfUnit + unit * 7, [Direct.Left, Direct.Up]],
    [unit * 8, [Direct.Up]],
  ];

  // 0是上、90 是右、180 是下、270 是左
  const angle = getAngle([0, 0], [x, y]);
  const match = matches.find((v) => v[0] > angle);
  if (match) return match[1];
  return [Direct.None];
}
