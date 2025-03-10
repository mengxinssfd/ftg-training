import { Direct } from '@core';
import { getAngle } from '@tool-pack/basic';

/**
 * 把手柄摇杆的轴状态转为对应的方向
 * @param axes
 * @param deadZone
 */
export function parserDirectsFromAxes(axes: [x: number, y: number], deadZone = 0.005): Direct[] {
  // 如果输入的数值小于死区则判定为未输入
  if (axes.every((v) => Math.abs(v) < deadZone)) return [Direct.None];

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
  const angle = getAngle([0, 0], axes);
  const match = matches.find((v) => v[0] > angle);
  if (match) return match[1];
  return [Direct.None];
}
