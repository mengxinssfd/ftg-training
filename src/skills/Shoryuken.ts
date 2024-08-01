import { Skill } from './Skill';
import { Down, DownRight, LightPunch, Right } from '../keys';
import type { InputManager } from '../InputManager';
import { AttackType } from '../types';

export class Shoryuken extends Skill {
  name = '升龙拳';
  keys = [Right, Down, DownRight, LightPunch];
  override match(history: InputManager): boolean {
    const keys = history.keyRecorder;
    if (keys.length < 4) return false;
    let i = 0;
    if (keys[i++]!.attacks.every((a) => a.attackType !== AttackType.Punch)) return false;
    if (keys[i++]!.direct !== DownRight) return false;
    if (keys[i++]!.direct !== Down) return false;
    if (keys[i]!.direct !== Right) return false;
    return true;
  }
}
