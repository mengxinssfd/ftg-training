import { Skill } from './Skill';
import type { InputManager } from '../InputManager';
import { AttackType } from '../types';
import { Down, DownRight, LightPunch, Right } from '../keys';

export class Hadouken extends Skill {
  name = '波动拳';
  keys = [Down, DownRight, Right, LightPunch];
  override match(history: InputManager): boolean {
    const keys = history.keyRecorder;
    console.log(keys.map((k) => k.direct.icon));
    if (keys.length < 4) return false;
    let i = 0;
    if (keys[i++]!.attacks.every((a) => a.attackType !== AttackType.Punch)) return false;
    if (keys[i++]!.direct !== Right) return false;
    if (keys[i++]!.direct !== DownRight) return false;
    if (keys[i]!.direct !== Down) return false;
    return true;
  }
}
