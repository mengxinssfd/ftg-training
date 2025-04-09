import type { Direct, PlayerLocation } from './enums';
import type { DynamicEnum } from '@tool-pack/basic';
import type { DirectCollector } from './input';

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

export type ValueOfKeymap = string | number;
export type KeyOfKeymap = Direct | string | readonly ValueOfKeymap[];
export type MapOfKeymap = Map<KeyOfKeymap, ValueOfKeymap>;
export type MapArrayOfKeymap = readonly [key: KeyOfKeymap, value: ValueOfKeymap][];
export type Keymap = DynamicEnum<KeyOfKeymap, ValueOfKeymap>;
export type InputResult = Pick<InputHistory, 'direct' | 'others'>;
export type SOCD = (directs: DirectCollector) => void;
