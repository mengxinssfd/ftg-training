import { Direct, XboxGamepadInput } from '@core';
import type { Keymap } from '@core';
import { DynamicEnum } from '@tool-pack/basic';
import type { KeymapArrayType } from '@/common/keymap/types';
import { loadKeymap, OtherKeys } from '@/common';

const gamepadKeyMaps = XboxGamepadInput.Keymap;
export const gamepadStorageKey = 'gamepadMap';
export const defGamepadMapArr: KeymapArrayType = [
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
  [[OtherKeys.LP, OtherKeys.MP, OtherKeys.HP], ''],
  [[OtherKeys.LK, OtherKeys.MK, OtherKeys.HK], ''],
];
export const gamepadMap: Keymap = new DynamicEnum(
  new Map(loadKeymap(gamepadStorageKey, defGamepadMapArr)),
);
