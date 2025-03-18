import { Direct } from '@core';
import { OtherKeys } from './OtherKeys';
import { DynamicEnum } from '@tool-pack/basic';

export const keyboardMap = new DynamicEnum(
  new Map([
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
    [[OtherKeys.HP, OtherKeys.HK], 'KeyH'],
    [[OtherKeys.MK, OtherKeys.MP], 'KeyY'],
    [[OtherKeys.LP, OtherKeys.HP], 'KeyN'],
    [[OtherKeys.LK, OtherKeys.HK], 'KeyM'],
  ]),
);
