import type { Keymap, MapArrayOfKeymap } from '@core';
import { Direct } from '@core';
import { OtherKeys } from '@/common';
import { DynamicEnum } from '@tool-pack/basic';
import { emptyKeymap } from '@/common/keymap/emptyKeymap';

// obs 的浏览器键盘事件没有code，只有key
// export const defKeyboardMapArr: MapArrayOfKeymap = [
//   [Direct.Up, 'Space'],
//   [Direct.Left, 'KeyA'],
//   [Direct.Down, 'KeyS'],
//   [Direct.Right, 'KeyD'],
//
//   [OtherKeys.LP, 'KeyU'],
//   [OtherKeys.MP, 'KeyI'],
//   [OtherKeys.HP, 'KeyO'],
//   [OtherKeys.LK, 'KeyJ'],
//   [OtherKeys.MK, 'KeyK'],
//   [OtherKeys.HK, 'KeyL'],
//   [[OtherKeys.HP, OtherKeys.HK], ''],
//   [[OtherKeys.MK, OtherKeys.MP], ''],
//   ...emptyKeymap,
// ];
export const defKeyboardMapArr: MapArrayOfKeymap = [
  [Direct.Up, 'space'],
  [Direct.Left, 'a'],
  [Direct.Down, 's'],
  [Direct.Right, 'd'],

  [OtherKeys.LP, 'u'],
  [OtherKeys.MP, 'i'],
  [OtherKeys.HP, 'o'],
  [OtherKeys.LK, 'j'],
  [OtherKeys.MK, 'k'],
  [OtherKeys.HK, 'l'],
  [OtherKeys['3X'], 'm'],
  [[OtherKeys.HP, OtherKeys.HK], ''],
  [[OtherKeys.MK, OtherKeys.MP], ''],
  ...emptyKeymap,
];
export const keyboardMap: Keymap = new DynamicEnum(new Map(defKeyboardMapArr));
