import type { Keymap, MapArrayOfKeymap } from '@core';
import { Direct } from '@core';
import { OtherKeys } from '@/common';
import { DynamicEnum } from '@tool-pack/basic';
import { emptyKeymap } from '@/common/keymap/emptyKeymap';

export const defKeyboardMapArr: MapArrayOfKeymap = [
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
  ...emptyKeymap,
];
export const keyboardMap: Keymap = new DynamicEnum(new Map(defKeyboardMapArr));
