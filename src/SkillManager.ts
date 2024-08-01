import type { Skill } from './skills/Skill';
import type { InputManager } from './InputManager';

export class SkillManager {
  private readonly _skills: Skill[] = [];
  registerSkills(skills: Skill[]) {
    const s = skills.slice();
    s.sort((a, b) => a.matchPriority - b.matchPriority);
    this._skills.push(...s);
  }
  match(inputManager: InputManager): Skill | null {
    const len = this._skills.length;
    for (let i = 0; i < len; i++) {
      const skill = this._skills[i] as Skill;
      if (skill.match(inputManager)) {
        return skill;
      }
    }
    return null;
  }
}
