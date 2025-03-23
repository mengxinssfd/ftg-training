import type { Keymap } from '@core';
import { Direct } from '@core';
import { OtherKeys } from '@/common';
import { DynamicEnum } from '@tool-pack/basic';
import type { KeymapArrayType } from '@/common/keymap/types';
import { loadKeymap } from '@/common/keymap/utils';

export const keyboardStorageKey = 'keyboardMap';
export const defKeyboardMapArr: KeymapArrayType = [
  [Direct.Up, 'Space'],
  [Direct.Left, 'KeyA'],
  [Direct.Down, 'KeyS'],
  [Direct.Right, 'KeyD'],

  [OtherKeys.LP, 'KeyU'],
  [OtherKeys.MP, 'KeyI'],
  [OtherKeys.HP, 'KeyO'],
  [OtherKeys.LK, 'KeyJ'],
  [OtherKeys.MK, 'KeyK'],
  [OtherKeys.HK, 'KeyL'],
  [[OtherKeys.HP, OtherKeys.HK], ''],
  [[OtherKeys.MK, OtherKeys.MP], ''],
  [[OtherKeys.LP, OtherKeys.MP, OtherKeys.HP], ''],
  [[OtherKeys.LK, OtherKeys.MK, OtherKeys.HK], ''],
];
export const keyboardMap: Keymap = new DynamicEnum(
  new Map(loadKeymap(keyboardStorageKey, defKeyboardMapArr)),
);
