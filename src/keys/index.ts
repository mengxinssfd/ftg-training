import type { Key } from '../types';
import { HeavyKick, HeavyPunch, LightKick, LightPunch, MediumKick, MediumPunch } from './attacks';
import { Down, DownLeft, DownRight, Left, None, Right, Up, UpLeft, UpRight } from './directs';

export const AllKeys: Key[] = [
  // directs
  None,
  Up,
  Down,
  Left,
  Right,
  UpLeft,
  UpRight,
  DownLeft,
  DownRight,
  // attacks
  LightPunch,
  MediumPunch,
  HeavyPunch,
  LightKick,
  MediumKick,
  HeavyKick,
];

export * from './directs';
export * from './attacks';
