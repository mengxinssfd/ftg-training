import { Direct, XboxGamepadInput } from '@core';
import type { Keymap, MapArrayOfKeymap } from '@core';
import { DynamicEnum } from '@tool-pack/basic';
import { OtherKeys } from '@/common';
import { emptyKeymap } from '@/common/keymap/emptyKeymap';

const gamepadKeyMaps = XboxGamepadInput.Keymap;
export const defGamepadMapArr: MapArrayOfKeymap = [
  [Direct.Up, gamepadKeyMaps.Up],
  [Direct.Left, gamepadKeyMaps.Left],
  [Direct.Down, gamepadKeyMaps.Down],
  [Direct.Right, gamepadKeyMaps.Right],

  [OtherKeys.LP, gamepadKeyMaps.X],
  [OtherKeys.MP, gamepadKeyMaps.Y],
  [OtherKeys.HP, gamepadKeyMaps.RB],
  [OtherKeys.LK, gamepadKeyMaps.A],
  [OtherKeys.MK, gamepadKeyMaps.B],
  [OtherKeys.HK, gamepadKeyMaps.RT],
  [[OtherKeys.MK, OtherKeys.MP], gamepadKeyMaps.LT],
  [[OtherKeys.HK, OtherKeys.HP], gamepadKeyMaps.LB],
  ...emptyKeymap,
];
export const gamepadMap: Keymap = new DynamicEnum(new Map(defGamepadMapArr));
