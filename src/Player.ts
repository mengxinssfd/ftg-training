import { SkillManager } from './SkillManager';
import { InputManager } from './InputManager';
import { Skill } from './skills';
import type { Key } from './types';

export class Player {
  skillManager: SkillManager;
  inputManager: InputManager;

  constructor(skills: Skill[], keys: Key[]) {
    this.inputManager = new InputManager();
    this.inputManager.registerKeys(keys);
    this.skillManager = new SkillManager();
    this.skillManager.registerSkills(skills);
  }

  input(key: string, type: 'down' | 'up'): void {
    this.inputManager.input(key, type);
  }

  matchSkill(): Skill | null {
    return this.skillManager.match(this.inputManager);
  }

  clearInputs(): void {
    this.inputManager.clear();
  }
}
