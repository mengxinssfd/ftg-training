import styles from './App.module.scss';
import { XboxGamepadInput, KeyboardInput, Player, socdN } from '@core';
import type { SOCD } from '@core';
import {
  HitBoxInput,
  InputHistory,
  InputViewer,
  SkillList,
  LocationSettings,
  SocdSettings,
  KeyboardSettings,
  GamepadSettings,
  ThemeSettings,
} from './components';
import { gamepadMap, keyboardMap, useSkillMatch } from '@/common';
import type { ImpSkill } from '@/common';
import * as skills from '@/common/skills';

let _socd = socdN;
const socd: SOCD = (d) => _socd(d);
const hbi = new HitBoxInput(socd);
const skillList = Object.values(skills) as ImpSkill[];
const xboxInput = new XboxGamepadInput(gamepadMap, socd);
const player = new Player(skillList, [xboxInput, new KeyboardInput(keyboardMap, socd), hbi]);

function App() {
  const [skill, frame] = useSkillMatch({ player });
  return (
    <div className={styles['_']}>
      <section className={styles['nav']}>
        <GamepadSettings gamepadInput={xboxInput} />
        <KeyboardSettings />
        <LocationSettings location={player.location} onChange={(l) => (player.location = l)} />
        <SocdSettings onChange={(s) => (_socd = s)} />
        <ThemeSettings />
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
