import type { Directs, PlayerLocation } from './enums';

export interface InputHistory {
  others: string[];
  direct: Directs;
  startFrame: number;
  location: PlayerLocation;
}

export interface Skill {
  matchPriority: number;
  limitFrame: number;
  name: string;
  directs: Directs[][] | ((ih: InputHistory[], skill: Skill, frame: number) => boolean);
  trigger: string | ((input: InputHistory) => boolean);
  handler?: () => void;
}

export type Keymap = Record<string, string | number | (string | number)[]>;
export type InputResult = Pick<InputHistory, 'direct' | 'others'>;
