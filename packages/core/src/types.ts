import type { Directs, PlayerLocation } from './enums';

export interface InputHistory {
  others: (string | number)[];
  direct: Directs;
  startFrame: number;
  location: PlayerLocation;
}

export type SkillDirectsTrigger = (ih: InputHistory[], skill: Skill, frame: number) => boolean;
export interface Skill {
  matchPriority: number;
  limitFrame: number;
  name: string;
  directs: Directs[][] | SkillDirectsTrigger;
  trigger: string | ((input: InputHistory) => boolean);
  handler?: () => void;
}

export type Keymap = Record<string, string | number | (string | number)[]>;
export type InputResult = Pick<InputHistory, 'direct' | 'others'>;
