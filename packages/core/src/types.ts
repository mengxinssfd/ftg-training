import type { Direct, PlayerLocation } from './enums';

export interface InputHistory {
  others: (string | number)[];
  direct: Direct;
  startFrame: number;
  location: PlayerLocation;
}

export type SkillDirectsTrigger = (ih: InputHistory[], skill: Skill, frame: number) => boolean;
export interface Skill {
  matchPriority: number;
  limitFrame: number;
  name: string;
  directs: Direct[][] | SkillDirectsTrigger;
  trigger: string | ((input: InputHistory) => boolean);
  handler?: () => void;
}

export type Keymap = Record<string, string | number | readonly (string | number)[]>;
export type InputResult = Pick<InputHistory, 'direct' | 'others'>;
export type SOCD = (directs: Map<Direct, number>) => void;
