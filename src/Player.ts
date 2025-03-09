import { SkillManager } from './SkillManager';
import { InputManager } from './InputManager';
import { PlayerLocation } from './enums';
import type { Input } from './input';
import type { Skill } from './types';

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
  frameAdd(): void {
    this.frame++;
    this.inputManager.frameAdd(this.location, this.frame);
  }
  matchSkill(): Skill | null {
    return this.skillManager.match();
  }
  clearInputs(): void {
    this.inputManager.clear();
  }
}
