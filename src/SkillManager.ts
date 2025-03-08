import type { InputManager } from './InputManager';
import type { Skill } from './types';
import { matchCommand } from './utils';

export class SkillManager {
  private readonly _skills: Skill[] = [];
  constructor(private inputManager: InputManager) {}
  registerSkills(skills: Skill[]) {
    const s = skills.slice();
    s.sort((a, b) => b.matchPriority - a.matchPriority);
    this._skills.push(...s);
  }
  match(): Skill | null {
    const len = this._skills.length;
    for (let i = 0; i < len; i++) {
      const skill = this._skills[i] as Skill;
      if (this.matchSkill(this.inputManager, skill)) {
        skill.handler?.();
        return skill;
      }
    }
    return null;
  }
  private matchSkill(im: InputManager, skill: Skill): boolean {
    const lastHistory = im.inputHistory.at(-1);
    if (!lastHistory) return false;

    const trigger = skill.trigger;
    if (typeof trigger === 'function') {
      if (!trigger(lastHistory)) return false;
    } else {
      if (!(lastHistory.others.includes(trigger) || (lastHistory.direct as any) === trigger))
        return false;
    }
    if (typeof skill.directs === 'function') {
      return skill.directs(im.inputHistory, skill, im.frame);
    }
    return skill.directs.some((d) => matchCommand(d, im.inputHistory, skill.limitFrame, im.frame));
  }
}
