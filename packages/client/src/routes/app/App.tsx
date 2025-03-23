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
import { useSkillMatch, useOnlyHistory, useTheme } from '@/hooks';

const { player, xboxInput, hitboxInput, setSocd, skillList } = createPlayer();
function App() {
  const [skill, frame] = useSkillMatch({ player });
  const [onlyHistory, setOnlyHistory] = useOnlyHistory();
  const [theme, setTheme] = useTheme();
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
            <SocdSettings onChange={setSocd} />
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
