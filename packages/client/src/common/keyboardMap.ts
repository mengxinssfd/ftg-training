import { Direct } from '@core';
import { OtherKeys } from './OtherKeys';
import { DynamicEnum } from '@tool-pack/basic';

export const keyboardMap = new DynamicEnum(
  new Map<any, string>([
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
  ]),
);
