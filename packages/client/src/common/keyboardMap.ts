import { Direct } from '@core';
import type { Keymap } from '@core';
import { OtherKeys } from './OtherKeys';

export const keyboardMap = {
  ' ': Direct.Up,
  a: Direct.Left,
  s: Direct.Down,
  d: Direct.Right,

  u: OtherKeys.LP,
  i: OtherKeys.MP,
  o: OtherKeys.HP,
  j: OtherKeys.LK,
  k: OtherKeys.MK,
  l: OtherKeys.HK,
  h: [OtherKeys.HP, OtherKeys.HK],
  y: [OtherKeys.MK, OtherKeys.MP],
  n: [OtherKeys.LP, OtherKeys.HP],
  m: [OtherKeys.LK, OtherKeys.HK],
} satisfies Keymap;
