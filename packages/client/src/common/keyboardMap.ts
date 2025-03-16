import { Direct } from '@core';
import type { Keymap } from '@core';
import { OtherKeys } from './OtherKeys';

export const keyboardMap = {
  Space: Direct.Up,
  KeyA: Direct.Left,
  KeyS: Direct.Down,
  KeyD: Direct.Right,

  KeyU: OtherKeys.LP,
  KeyI: OtherKeys.MP,
  KeyO: OtherKeys.HP,
  KeyJ: OtherKeys.LK,
  KeyK: OtherKeys.MK,
  KeyL: OtherKeys.HK,
  KeyH: [OtherKeys.HP, OtherKeys.HK],
  KeyY: [OtherKeys.MK, OtherKeys.MP],
  KeyN: [OtherKeys.LP, OtherKeys.HP],
  KeyM: [OtherKeys.LK, OtherKeys.HK],
} satisfies Keymap;
