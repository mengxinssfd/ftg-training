import type { InputManager } from '../InputManager';
import type { Key } from '../types';

export abstract class Skill {
  matchPriority = 0;
  abstract name: string;
  abstract keys: Key[];
  abstract match(history: InputManager): boolean;
}
