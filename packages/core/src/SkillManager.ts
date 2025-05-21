import type { InputManager } from './InputManager';
import type { InputHistory, Skill } from './types';
import { matchCommand } from './utils';

/**
 * 技能管理器类
 *
 * @description
 * 负责管理和匹配游戏中的技能系统，主要功能包括：
 * - 注册和管理技能列表
 * - 根据输入历史匹配技能
 * - 处理技能触发条件
 * - 执行技能响应
 */
export class SkillManager {
  /** 已注册的技能列表，按优先级排序 */
  private readonly _skills: Skill[] = [];

  /**
   * 创建技能管理器实例
   * @param inputManager 输入管理器实例，用于获取输入历史
   */
  constructor(private inputManager: InputManager) {}

  /**
   * 注册技能列表
   *
   * @description
   * 将技能添加到管理器中，并按照优先级排序
   * - 优先级高的技能会优先匹配
   * - 相同输入条件下，优先级高的技能会被触发
   *
   * @param skills 要注册的技能数组
   *
   * @example
   * const skillManager = new SkillManager(inputManager);
   * skillManager.registerSkills([
   *   new FireballSkill(),
   *   new DragonPunchSkill()
   * ]);
   */
  registerSkills(skills: Skill[]) {
    const s = skills.slice();
    s.sort((a, b) => b.matchPriority - a.matchPriority);
    this._skills.push(...s);
  }

  /**
   * 匹配当前输入对应的技能
   *
   * @description
   * 检查当前输入序列是否触发了某个技能：
   * 1. 检查最后一个输入记录
   * 2. 按优先级遍历所有技能
   * 3. 验证技能的触发条件
   * 4. 执行匹配成功的技能
   *
   * @template S 技能类型
   * @returns 匹配到的技能实例，如果没有匹配则返回 null
   *
   * @example
   * const skill = skillManager.match();
   * if (skill) {
   *   // 技能匹配成功，执行相关逻辑
   * }
   */
  match<S extends Skill>(): S | null {
    const len = this._skills.length;
    const lastHistory = this.inputManager.inputHistories.at(-1);
    if (!lastHistory) return null;
    for (let i = 0; i < len; i++) {
      const skill = this._skills[i] as S;
      if (this.matchSkill(this.inputManager, skill, lastHistory)) {
        skill.handler?.();
        return skill;
      }
    }
    return null;
  }

  /**
   * 检查指定技能是否匹配当前输入
   *
   * @private
   * @param im 输入管理器实例
   * @param skill 要检查的技能
   * @param lastHistory 最后一次输入记录
   * @returns 是否匹配成功
   *
   * @description
   * 技能匹配的判定流程：
   * 1. 验证技能的触发键
   * 2. 检查方向输入序列
   * 3. 验证其他特殊条件
   */
  private matchSkill(im: InputManager, skill: Skill, lastHistory: InputHistory): boolean {
    const trigger = skill.trigger;
    if (typeof trigger === 'function') {
      if (!trigger(lastHistory)) return false;
    } else {
      if (!(lastHistory.others.includes(trigger) || (lastHistory.direct as any) === trigger))
        return false;
    }
    if (typeof skill.directs === 'function') {
      return skill.directs(im.inputHistories, skill, im.frame);
    }
    return skill.directs.some((d) =>
      matchCommand(d, im.inputHistories, skill.limitFrame, im.frame),
    );
  }
}
