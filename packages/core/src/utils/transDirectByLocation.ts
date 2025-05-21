import { Direct, PlayerLocation } from '../enums';

/**
 * 根据玩家位置转换方向输入
 *
 * @param {PlayerLocation} location - 玩家所在位置（左侧或右侧）
 * @param {Direct} direct - 原始方向输入
 * @returns {Direct} 根据玩家位置转换后的方向
 *
 * @description
 * 该函数用于处理双人对战游戏中，根据玩家所在位置调整方向输入。
 * 当玩家在右侧时，会将水平方向（左右）进行镜像翻转，以保证操作的一致性。
 *
 * 转换规则：
 * - 玩家在左侧时：保持原始方向不变
 * - 玩家在右侧时：进行水平方向的镜像翻转
 *   - 左 <-> 右
 *   - 左上 <-> 右上
 *   - 左下 <-> 右下
 *   - 上、下方向保持不变
 *
 * @example
 * // 玩家在右侧，输入左方向
 * const result1 = transDirectByLocation(PlayerLocation.Right, Direct.Left);
 * // 返回 Direct.Right
 *
 * // 玩家在左侧，输入保持不变
 * const result2 = transDirectByLocation(PlayerLocation.Left, Direct.UpLeft);
 * // 返回 Direct.UpLeft
 *
 * // 非水平方向不受影响
 * const result3 = transDirectByLocation(PlayerLocation.Right, Direct.Up);
 * // 返回 Direct.Up
 */
export function transDirectByLocation(location: PlayerLocation, direct: Direct): Direct {
  if (location === PlayerLocation.Left) return direct;
  const rev = {
    [Direct.Left]: Direct.Right,
    [Direct.Right]: Direct.Left,
    [Direct.UpLeft]: Direct.UpRight,
    [Direct.UpRight]: Direct.UpLeft,
    [Direct.DownLeft]: Direct.DownRight,
    [Direct.DownRight]: Direct.DownLeft,
  };
  return rev[direct as keyof typeof rev] ?? direct;
}
