import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { Direct, XboxGamepadInput, KeyboardInput, Player, socdN } from '@core';
import type { SOCD } from '@core';
import {
  HitBoxInput,
  InputHistory,
  InputViewer,
  SkillList,
  LocationSettings,
  SocdSettings,
  KeyboardSettings,
} from './components';
import { OtherKeys, keyboardMap } from '@/common';
import type { ImpSkill } from '@/common';
import * as skills from '@/common/skills';
import { DynamicEnum } from '@tool-pack/basic';

const gamepadKeyMaps = XboxGamepadInput.Keymap;
const gamepadMap = new DynamicEnum(
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
  ]),
);
let _socd = socdN;
const socd: SOCD = (d) => {
  _socd(d);
};
const hbi = new HitBoxInput(socd);
const skillList = Object.values(skills);
const player = new Player(skillList, [
  new XboxGamepadInput(gamepadMap, socd),
  new KeyboardInput(keyboardMap, socd),
  hbi,
]);
const f = 1000 / 60;
const odReplaceFrame = 5; // od技和普通技能在 odTime 帧数内则替换为 od 技
const nextSkillFrame = 50; // 50 帧内不得再次匹配技能
function App() {
  const [frame, setFrame] = useState<number>(0);
  const [skill, setSkill] = useState<ImpSkill>();
  useEffect(() => {
    const lastMatched: { frame: number; skill: ImpSkill | null } = { frame: -50, skill: null };
    const timer = setInterval(function handler() {
      player.frameAdd();
      setFrame(player.frame);
      const frameDiff = player.frame - lastMatched.frame;
      // 如果距离上次搓招成功大于 100 帧，则撤销显示技能
      if (frameDiff > 100) setSkill(undefined);
      const skill = player.matchSkill<ImpSkill>();
      if (skill) {
        // 如果距离上一次搓招成功小于 50 帧则不可再次搓招判定,除了 OD技
        if (frameDiff < nextSkillFrame) {
          if (frameDiff < odReplaceFrame && skill.extends && skill.extends === lastMatched.skill) {
            _setSkill();
          }
          return;
        }
        _setSkill();
      }
      function _setSkill(): void {
        setSkill((lastMatched.skill = skill));
        lastMatched.frame = player.frame;
      }
    }, f);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={styles['_']}>
      <section className={styles.nav}>
        <KeyboardSettings />
        <LocationSettings location={player.location} onChange={(l) => (player.location = l)} />
        <SocdSettings onChange={(s) => (_socd = s)} />
      </section>
      <InputHistory inputHistories={player.inputManager.inputHistories} frame={frame} />
      <InputViewer inputHistories={player.inputManager.inputHistories} />
      <div className="skill">
        <div>{skill?.commandView}</div>
        <div>{skill?.name}</div>
      </div>
      <hbi.HitBox />
      <SkillList skillList={skillList} />
    </div>
  );
}

export default App;
