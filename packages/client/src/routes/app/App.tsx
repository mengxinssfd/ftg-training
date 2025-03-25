import styles from './App.module.scss';
import {
  InputHistory,
  InputViewer,
  SkillList,
  LocationSettings,
  SocdSettings,
  KeyboardSettings,
  GamepadSettings,
  ThemeSettings,
  type KeyboardConfig,
  type GamepadConfig,
  type Theme,
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
import { useSkillMatch, useLocalStorageState, themes } from '@/hooks';
import { socdN, socdLW, socdFW, XboxGamepadInput } from '@core';

const socdMap = { socdN, socdLW, socdFW } as const;
const { player, xboxInput, hitboxInput, setSocd, skillList } = createPlayer();
function App() {
  const [skill, frame] = useSkillMatch({ player });
  const [config, setConfig] = useLocalStorageState({
    storageKey: 'config',
    defaultValue: (): { socd: keyof typeof socdMap; onlyHistory: boolean; theme: Theme } => ({
      socd: 'socdN',
      onlyHistory: false,
      theme: 'light',
    }),
    onChange(v, p): void {
      setSocd(socdMap[v.socd]);
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
      id: '',
    }),
    onChange: (v): void => {
      xboxInput.leftStickDeadZone = v.deadZone;
      xboxInput.idOfGamepad = v.id;
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
            <LocationSettings location={player.location} onChange={(l) => (player.location = l)} />
            <SocdSettings
              socd={config.socd}
              onChange={(v) => setConfig({ ...config, socd: v as keyof typeof socdMap })}
            />
            <ThemeSettings
              theme={config.theme}
              setTheme={(theme) => setConfig({ ...config, theme })}
            />
          </>
        )}
      </section>
      <InputHistory inputHistories={player.inputManager.inputHistories} frame={frame} />
      {!config.onlyHistory && (
        <>
          <InputViewer inputHistories={player.inputManager.inputHistories} />
          <div className="skill">
            <div>{skill?.commandView}</div>
            <div>{skill?.name}</div>
          </div>
          <hitboxInput.HitBox />
          <SkillList skillList={skillList} />
        </>
      )}
    </div>
  );
}

export default App;
