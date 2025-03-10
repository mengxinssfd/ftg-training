import { useEffect, useRef, useState } from 'react';
import styles from './App.module.scss';
import { Direct, XboxGamepadInput, KeyboardInput, Player, PlayerLocation, socdN } from '@core';
import type { Keymap } from '@core';
import { HitBoxInput, InputHistory, InputViewer } from './components';
import { OtherKeys } from '@/common/OtherKeys';
import type { ImpSkill } from '@/common/skills';
import * as skills from '@/common/skills';

const keyboardMap = {
  ' ': Direct.Up,
  a: Direct.Left,
  s: Direct.Down,
  d: Direct.Right,

  u: OtherKeys.LP,
  i: OtherKeys.MP,
  o: OtherKeys.HP,
  j: OtherKeys.LK,
  k: OtherKeys.MK,
  l: OtherKeys.HK,
  h: [OtherKeys.HP, OtherKeys.HK],
  y: [OtherKeys.MK, OtherKeys.MP],
  n: [OtherKeys.LP, OtherKeys.HP],
  m: [OtherKeys.LK, OtherKeys.HK],
} satisfies Keymap;
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
function App() {
  const [frame, setFrame] = useState<number>(0);
  const [skill, setSkill] = useState<ImpSkill>();
  const matchedFrameRef = useRef(-10);
  useEffect(() => {
    const timer = setInterval(function handler() {
      player.frameAdd();
      setFrame(player.frame);
      const frameDiff = player.frame - matchedFrameRef.current;
      // 如果距离上一次搓招成功小于 10 帧则不可再次搓招判定
      if (frameDiff < 10) return;
      // 如果距离上次搓招成功大于 100 帧，则撤销显示技能
      else if (frameDiff > 100) {
        setSkill(undefined);
      }
      const skill = player.matchSkill();
      if (skill) {
        setSkill(skill as ImpSkill);
        matchedFrameRef.current = player.frame;
      }
    }, f);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={styles['_']}>
      <div className="location">
        <label>
          站位：
          <select
            name="location"
            onChange={(e) => {
              player.location =
                e.target.value === String(PlayerLocation.Left)
                  ? PlayerLocation.Left
                  : PlayerLocation.Right;
            }}
            defaultValue={player.location}>
            <option key={PlayerLocation.Left} value={PlayerLocation.Left}>
              1P
            </option>
            <option key={PlayerLocation.Right} value={PlayerLocation.Right}>
              2P
            </option>
          </select>
        </label>
      </div>
      <InputHistory inputHistories={player.inputManager.inputHistories} frame={frame} />
      <InputViewer inputHistories={player.inputManager.inputHistories} />
      <div className="skill">
        <div>{skill?.commandView}</div>
        <div>{skill?.name}</div>
      </div>
      <hbi.HitBox />
      <section className="skill-list">
        搓招表：
        <ul>
          {skillList.map((v, i) => {
            return (
              <li key={i}>
                <span>{v.commandView}</span>
                <span>{v.name}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default App;
