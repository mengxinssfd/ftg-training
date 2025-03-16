import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { Direct, XboxGamepadInput, KeyboardInput, Player, socdN } from '@core';
import type { Keymap } from '@core';
import { HitBoxInput, InputHistory, InputViewer, SkillList, LocationSettings } from './components';
import { OtherKeys, keyboardMap } from '@/common';
import type { ImpSkill } from '@/common';
import * as skills from '@/common/skills';

const gamepadKeyMaps = XboxGamepadInput.Keymap;
const gamepadMap = {
  [gamepadKeyMaps.Up]: Direct.Up,
  [gamepadKeyMaps.Left]: Direct.Left,
  [gamepadKeyMaps.Down]: Direct.Down,
  [gamepadKeyMaps.Right]: Direct.Right,

  [gamepadKeyMaps.X]: OtherKeys.LP,
  [gamepadKeyMaps.Y]: OtherKeys.MP,
  [gamepadKeyMaps.RB]: OtherKeys.HP,
  [gamepadKeyMaps.A]: OtherKeys.LK,
  [gamepadKeyMaps.B]: OtherKeys.MK,
  [gamepadKeyMaps.RT]: OtherKeys.HK,
  [gamepadKeyMaps.LT]: [OtherKeys.MK, OtherKeys.MP],
  [gamepadKeyMaps.LB]: [OtherKeys.HK, OtherKeys.HP],
} satisfies Keymap;
const hbi = new HitBoxInput(socdN);
const skillList = Object.values(skills);
const player = new Player(skillList, [
  new XboxGamepadInput(gamepadMap, socdN),
  new KeyboardInput(keyboardMap, socdN),
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
      <LocationSettings location={player.location} onChange={(l) => (player.location = l)} />
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
