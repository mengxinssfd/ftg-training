import styles from './App.module.scss';
import {
  type GamepadConfig,
  GamepadSettings,
  InputHistory,
  DefaultInputHistoryFontSize,
  InputViewer,
  KeyboardSettings,
  type OtherConfig,
  OtherSettings,
  SkillList,
  themes,
  useKeyboardSettings,
} from './components';
import { createPlayer, defGamepadMapArr, gamepadMap, resetKeymap } from '@/common';
import { Checkbox } from 'antd';
import { useLocalStorageState, useSkillMatch } from '@/hooks';
import { socdFW, socdLW, socdN, XboxGamepadInput } from '@core';

const socdMap = { socdN, socdLW, socdFW } as const;
const { player, xboxInput, hitboxInput, setSocd, skillList } = createPlayer();
function App() {
  const [config, setConfig] = useLocalStorageState({
    storageKey: 'config',
    defaultValue: (): OtherConfig => ({
      socd: 'socdN',
      theme: 'light',
      location: player.location,
      inputHistory: {
        fontSize: DefaultInputHistoryFontSize,
        layout: 'vertical',
        only: false,
      },
      visibles: {
        skillList: true,
        hitbox: true,
        inputViewer: true,
        skillMatch: true,
      },
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
  const [skill, frame] = useSkillMatch(player, !config.inputHistory.only);
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
  const { isKeyboardClear, setKeyboardClear, setKeyboardConfig } =
    useKeyboardSettings(clearHistory);

  return (
    <div className={styles['_']}>
      <section className={styles['nav']}>
        <Checkbox
          checked={config.inputHistory.only}
          onChange={(e) =>
            setConfig({
              ...config,
              inputHistory: { ...config.inputHistory, only: e.target.checked },
            })
          }>
          <span style={{ color: 'pink' }}>只显示输入历史</span>
        </Checkbox>
        {!config.inputHistory.only && (
          <>
            <GamepadSettings config={gamepadConfig} onChange={setGamepadConfig} />
            <KeyboardSettings
              isClear={isKeyboardClear}
              setClear={setKeyboardClear}
              onChange={setKeyboardConfig}
            />
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
        lay={config.inputHistory.layout}
        fontSize={config.inputHistory.fontSize}
      />
      {!config.inputHistory.only && (
        <>
          {config.visibles.inputViewer && (
            <InputViewer inputHistories={player.inputManager.inputHistories} />
          )}
          {config.visibles.skillMatch && (
            <div className="skill">
              <div>{skill?.commandView}</div>
              <div>{skill?.name}</div>
            </div>
          )}
          {config.visibles.hitbox && <hitboxInput.HitBox />}
          {config.visibles.skillList && <SkillList skillList={skillList} />}
        </>
      )}
    </div>
  );

  function clearHistory(): void {
    player.clearInputs();
  }
}

export default App;
