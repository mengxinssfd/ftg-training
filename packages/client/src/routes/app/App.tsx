import styles from './App.module.scss';
import {
  type GamepadConfig,
  GamepadSettings,
  InputHistory,
  InputViewer,
  type KeyboardConfig,
  KeyboardSettings,
  type OtherConfig,
  OtherSettings,
  SkillList,
  themes,
} from './components';
import {
  createPlayer,
  defGamepadMapArr,
  defKeyboardMapArr,
  gamepadMap,
  keyboardMap,
  resetKeymap,
} from '@/common';
import { Checkbox } from 'antd';
import { useLocalStorageState, useSkillMatch } from '@/hooks';
import { socdFW, socdLW, socdN, XboxGamepadInput } from '@core';

const socdMap = { socdN, socdLW, socdFW } as const;
const { player, xboxInput, hitboxInput, setSocd, skillList } = createPlayer();
function App() {
  const [skill, frame] = useSkillMatch({ player });
  const [config, setConfig] = useLocalStorageState({
    storageKey: 'config',
    defaultValue: (): OtherConfig => ({
      socd: 'socdN',
      onlyHistory: false,
      theme: 'light',
      historyLay: 'vertical',
      location: player.location,
      skillListVisible: true,
      hitboxVisible: true,
      inputViewerVisible: true,
      skillMatchVisible: true,
    }),
    onChange(v, p): void {
      setSocd(socdMap[v.socd]);
      player.location = v.location;
      if (p?.theme !== v.theme) {
        const prefix = 'theme-';
        document.body.classList.remove(...themes.map((t) => prefix + t));
        document.body.classList.add(prefix + v.theme);
      }
    },
  });
  const [gamepadConfig, setGamepadConfig] = useLocalStorageState({
    storageKey: 'gamepadConfig',
    defaultValue: (): GamepadConfig => ({
      deadZone: XboxGamepadInput.DefaultLeftStickDeadZone,
      keymap: defGamepadMapArr,
      indexOfGamepads: 0,
    }),
    onChange: (v): void => {
      xboxInput.leftStickDeadZone = v.deadZone;
      xboxInput.indexOfGamepads = v.indexOfGamepads;
      resetKeymap(gamepadMap, v.keymap);
    },
  });
  const [keyboardConfig, setKeyboardConfig] = useLocalStorageState({
    storageKey: 'keyboardConfig',
    defaultValue: (): KeyboardConfig => ({ keymap: defKeyboardMapArr }),
    onChange: (v): void => resetKeymap(keyboardMap, v.keymap),
  });

  return (
    <div className={styles['_']}>
      <section className={styles['nav']}>
        <Checkbox
          checked={config.onlyHistory}
          onChange={(e) => setConfig({ ...config, onlyHistory: e.target.checked })}>
          <span style={{ color: 'pink' }}>只显示输入历史</span>
        </Checkbox>
        {!config.onlyHistory && (
          <>
            <GamepadSettings config={gamepadConfig} onChange={setGamepadConfig} />
            <KeyboardSettings config={keyboardConfig} onChange={setKeyboardConfig} />
            <OtherSettings
              config={config}
              onChange={setConfig}
              clearInputs={() => player.clearInputs()}
            />
            <a href="https://github.com/mengxinssfd/ftg-training">github</a>
          </>
        )}
      </section>
      <InputHistory
        inputHistories={player.inputManager.inputHistories}
        frame={frame}
        lay={config.historyLay}
      />
      {!config.onlyHistory && (
        <>
          {config.inputViewerVisible && (
            <InputViewer inputHistories={player.inputManager.inputHistories} />
          )}
          {config.skillMatchVisible && (
            <div className="skill">
              <div>{skill?.commandView}</div>
              <div>{skill?.name}</div>
            </div>
          )}
          {config.hitboxVisible && <hitboxInput.HitBox />}
          {config.skillListVisible && <SkillList skillList={skillList} />}
        </>
      )}
    </div>
  );
}

export default App;
