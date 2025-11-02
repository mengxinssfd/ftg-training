import { Input } from './input';
import type { InputHistory, InputResult } from './types';
import type { PlayerLocation } from './enums';

/**
 * 输入管理器类，用于管理和记录游戏输入历史
 *
 * @class InputManager
 * @description
 * 该类负责管理游戏输入的历史记录，包括方向输入和其他按键输入。
 * 它维护一个输入历史队列，记录每一帧的输入状态变化。
 *
 * @property {number} historyMaxLen - 输入历史记录的最大长度，默认为 20000
 * @property {number} frame - 当前帧数
 * @property {InputHistory[]} inputHistories - 输入历史记录数组
 *
 * @constructor
 * @param {Input[]} inputs - 输入源数组
 *
 * @methods
 *
 * @example
 * // 创建输入管理器实例
 * const inputs = [new KeyboardInput(), new GamepadInput()];
 * const inputManager = new InputManager(inputs);
 *
 * // 每帧更新输入状态
 * inputManager.frameAdd(PlayerLocation.Left, currentFrame);
 *
 * // 设置历史记录最大长度
 * inputManager.setHistoryMaxLen(10000);
 *
 * // 清理资源
 * inputManager.destroy();
 */
export class InputManager {
  private historyMaxLen = 20000;
  frame = 0;
  inputHistories: InputHistory[] = [];
  constructor(private inputs: Input[]) {}
  /**
   * 添加当前帧的输入状态到历史记录
   *
   * @param {PlayerLocation} location - 玩家位置
   * @param {number} frame - 当前帧数
   * @description
   * 记录当前帧的输入状态。如果与上一帧输入相同，则不会记录。
   * 当历史记录超过最大长度时，会删除最早的记录。
   */
  frameAdd(location: PlayerLocation, frame: number): void {
    this.frame = frame;
    const input = Input.union(this.inputs);
    if (this.isSameInput(input)) return;
    this.inputHistories.push({ ...input, startFrame: this.frame, location: location });
    this.cutHistory(this.historyMaxLen);
  }
  private cutHistory(length: number): void {
    if (this.inputHistories.length > length) {
      this.inputHistories.splice(0, this.inputHistories.length - length);
    }
  }
  /**
   * 检查当前输入是否与上一次输入相同
   *
   * @private
   * @param {InputResult} input - 当前输入结果
   * @returns {boolean} 如果与上一次输入相同返回 true，否则返回 false
   * @description
   * 比较当前输入和上一次输入的方向和其他按键状态是否完全相同
   */
  private isSameInput(input: InputResult): boolean {
    const lastInput = this.inputHistories.at(-1);
    if (!lastInput) return false;
    return (
      input.direct === lastInput.direct &&
      lastInput.others.length === input.others.length &&
      lastInput.others.every((v, k) => v === input.others[k])
    );
  }
  /**
   * 清空所有输入历史记录
   *
   * @description
   * 将输入历史记录数组清空
   */
  clear(): void {
    this.inputHistories.length = 0;
  }
  /**
   * 设置历史记录的最大长度
   *
   * @param {number} length - 新的最大长度值
   * @description
   * 更新输入历史记录的最大保存长度
   */
  setHistoryMaxLen(length: number): void {
    this.cutHistory(length);
    this.historyMaxLen = length;
  }
  /**
   * 销毁输入管理器
   *
   * @description
   * 清空历史记录并销毁所有输入源
   */
  destroy(): void {
    this.clear();
    this.inputs.forEach((i) => i.destroy());
  }
}
