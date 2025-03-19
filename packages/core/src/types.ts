import type { Direct, PlayerLocation } from './enums';
import type { DynamicEnum } from '@tool-pack/basic';

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
  chargeFrame?: number;
  handler?: () => void;
}

export type KeyOfKeymap = Direct | string | (string | number)[];
export type Keymap = DynamicEnum<KeyOfKeymap, number | string>;
export type InputResult = Pick<InputHistory, 'direct' | 'others'>;
export type SOCD = (directs: Map<Direct, number>) => void;
