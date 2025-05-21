import { SkillManager } from './SkillManager';
import { InputManager } from './InputManager';
import { PlayerLocation } from './enums';
import type { Input } from './input';
import type { Skill } from './types';

/**
 * 玩家类，管理玩家的输入和技能系统
 *
 * @class Player
 * @description
 * 玩家类是游戏中玩家实体的核心类，负责：
 * - 管理玩家的输入系统
 * - 处理技能系统
 * - 维护玩家状态
 *
 * @property {SkillManager} skillManager - 技能管理器实例
 * @property {InputManager} inputManager - 输入管理器实例
 * @property {PlayerLocation} location - 玩家位置，默认为左侧
 * @property {number} frame - 当前帧数
 *
 * @constructor
 * @param {Skill[]} skills - 玩家可用的技能列表
 * @param {Input[]} inputs - 输入设备列表（如键盘、手柄等）
 *
 * @example
 * // 创建玩家实例
 * const skills = [new PunchSkill(), new KickSkill()];
 * const inputs = [new KeyboardInput()];
 * const player = new Player(skills, inputs);
 *
 * // 游戏循环中更新玩家状态
 * gameLoop(() => {
 *   player.frameAdd();
 *   const matchedSkill = player.matchSkill();
 *   if (matchedSkill) {
 *     // 处理技能释放
 *   }
 * });
 */
export class Player {
  skillManager: SkillManager;
  inputManager: InputManager;
  location = PlayerLocation.Left;
  frame = 0;

  constructor(skills: Skill[], inputs: Input[]) {
    this.inputManager = new InputManager(inputs);
    this.skillManager = new SkillManager(this.inputManager);
    this.skillManager.registerSkills(skills);
  }
  /**
   * 更新玩家帧数并记录输入
   *
   * @description
   * 在游戏每一帧调用，用于：
   * - 增加帧计数
   * - 记录当前帧的输入状态
   */
  frameAdd(): void {
    this.frame++;
    this.inputManager.frameAdd(this.location, this.frame);
  }
  /**
   * 检查并匹配当前输入对应的技能
   *
   * @template S - 技能类型
   * @returns {S | null} 返回匹配的技能实例，如果没有匹配则返回 null
   * @description
   * 根据当前的输入序列，检查是否触发了某个技能的输入条件
   */
  matchSkill<S extends Skill>(): S | null {
    return this.skillManager.match();
  }
  /**
   * 清空玩家的输入历史
   *
   * @description
   * 清除所有已记录的输入历史数据
   */
  clearInputs(): void {
    this.inputManager.clear();
  }
  /**
   * 销毁玩家实例
   *
   * @description
   * 清理玩家相关的所有资源，包括：
   * - 销毁输入管理器
   * - 清理相关事件监听
   */
  destroy(): void {
    this.inputManager.destroy();
  }
}
