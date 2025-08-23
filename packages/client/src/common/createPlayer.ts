import { KeyboardInput, Player, type SOCD, socdN, XboxGamepadInput } from '@core';
import { HitBoxInput } from '@/routes/app/components';
import * as skills from '@/common/skills';
import type { ImpSkill } from '@/common/skills';
import { gamepadMap, keyboardMap } from '@/common/keymap';
import { handle3X } from '@/common/handle3X';

export function createPlayer() {
  let _socd = socdN;
  const socd: SOCD = (d) => _socd(d);
  const hbi = new HitBoxInput(socd, handle3X);
  const skillList = Object.values(skills) as ImpSkill[];
  const xboxInput = new XboxGamepadInput(gamepadMap, socd, handle3X);
  const player = new Player(skillList, [
    xboxInput,
    new KeyboardInput(keyboardMap, socd, handle3X),
    hbi,
  ]);

  return {
    setSocd: (socd: SOCD) => (_socd = socd),
    player,
    xboxInput,
    skillList,
    hitboxInput: hbi,
  };
}
