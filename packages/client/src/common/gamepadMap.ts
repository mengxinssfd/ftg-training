import { Direct, XboxGamepadInput } from '@core';
import { DynamicEnum } from '@tool-pack/basic';
import { OtherKeys } from '@/common/OtherKeys';

const gamepadKeyMaps = XboxGamepadInput.Keymap;
export const gamepadMap = new DynamicEnum(
  new Map([
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
  ]),
);
