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
} from './components';
import { createPlayer } from '@/common';
import { Checkbox } from 'antd';
import { useSkillMatch, useTheme, useLocalStorageState } from '@/hooks';
import { useEffect } from 'react';
import { socdN, socdLW, socdFW } from '@core';

const { player, xboxInput, hitboxInput, setSocd: _setSocd, skillList } = createPlayer();
function App() {
  const [skill, frame] = useSkillMatch({ player });
  const [onlyHistory, setOnlyHistory] = useLocalStorageState(
    'onlyHistory',
    false,
    (v) => v === '1',
    (v) => (v ? '1' : '0'),
  );
  const [theme, setTheme] = useTheme();
  const [socd, setSocd] = useLocalStorageState('SOCD', 'socdN');
  useEffect(() => {
    const map = { socdN, socdLW, socdFW };
    _setSocd(map[socd as keyof typeof map]);
  }, [socd]);

  return (
    <div className={styles['_']}>
      <section className={styles['nav']}>
        <Checkbox checked={onlyHistory} onChange={(e) => setOnlyHistory(e.target.checked)}>
          <span style={{ color: 'pink' }}>只显示输入历史</span>
        </Checkbox>
        {!onlyHistory && (
          <>
            <GamepadSettings gamepadInput={xboxInput} />
            <KeyboardSettings />
            <LocationSettings location={player.location} onChange={(l) => (player.location = l)} />
            <SocdSettings socd={socd} onChange={setSocd} />
            <ThemeSettings theme={theme} setTheme={setTheme} />
          </>
        )}
      </section>
      <InputHistory inputHistories={player.inputManager.inputHistories} frame={frame} />
      {!onlyHistory && (
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
