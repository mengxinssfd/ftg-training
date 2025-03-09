import { Directs } from '@core';
import { getAngle } from '@tool-pack/basic';

/**
 * 把手柄摇杆的轴状态转为对应的方向
 * @param axes
 * @param deadZone
 */
export function parserDirectsFromAxes(axes: [x: number, y: number], deadZone = 0.005): Directs[] {
  // 如果输入的数值小于死区则判定为未输入
  if (axes.every((v) => Math.abs(v) < deadZone)) return [Directs.None];

  // 8 向的话 360 / 8 就是每个方位占据 45 度角
  const unit = 45;
  // 以正方位前后减去 45 的一半也就是 22.5 度角
  const halfUnit = 22.5;
  const matches: [range: number, direct: Directs[]][] = [
    [halfUnit, [Directs.Up]],
    [halfUnit + unit, [Directs.Up, Directs.Right]],
    [halfUnit + unit * 2, [Directs.Right]],
    [halfUnit + unit * 3, [Directs.Right, Directs.Down]],
    [halfUnit + unit * 4, [Directs.Down]],
    [halfUnit + unit * 5, [Directs.Down, Directs.Left]],
    [halfUnit + unit * 6, [Directs.Left]],
    [halfUnit + unit * 7, [Directs.Left, Directs.Up]],
    [unit * 8, [Directs.Up]],
  ];

  // 0是上、90 是右、180 是下、270 是左
  const angle = getAngle([0, 0], axes);
  const match = matches.find((v) => v[0] > angle);
  if (match) return match[1];
  return [Directs.None];
}
