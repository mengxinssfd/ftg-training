import style from './GamepadSettings.module.scss';
import { defGamepadMapArr, gamepadMap, resetKeymap } from '@/common';
import { GamepadInput, type KeyOfKeymap, type MapArrayOfKeymap, XboxGamepadInput } from '@core';
import { useEffect, useState } from 'react';
import { Button, InputNumber, Modal, Select, Space, Switch } from 'antd';
import { KeymapTable } from '@/routes/app/components/settings/KeymapTable';
import { useGamepadChange, useLocalStorageState } from '@/hooks';

export interface GamepadConfig {
  deadZone: number;
  indexOfGamepads: number;
  keymap: MapArrayOfKeymap;
}
export function GamepadSettings({
  config,
  onChange,
  isClear,
  setClear,
}: {
  config: GamepadConfig;
  onChange: (value: GamepadConfig) => void;
  isClear: boolean;
  setClear: (value: boolean) => void;
}): JSX.Element {
  const [activeKey, setActiveKey] = useState<KeyOfKeymap | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gamepads, setGamepads] = useState<Gamepad[]>(getGamepads);

  // 轮询更新可用手柄
  useEffect((): void | (() => void) => {
    if (!isModalOpen) return;
    const timer = setInterval(() => setGamepads(getGamepads()), 1000);
    return () => clearInterval(timer);
  }, [isModalOpen]);

  useGamepadChange(
    activeKey !== undefined,
    (_leftStickDirect, buttons) => {
      const btn = buttons[0];
      if (!btn || activeKey === undefined) return;
      gamepadMap.setOrSwap(activeKey, btn.index);
      onChange({ ...config, keymap: gamepadMap.map((v, k) => [k, v]) });
      setActiveKey(undefined);
    },
    config.indexOfGamepads,
    config.deadZone,
  );

  return (
    <>
      <Button size="small" onClick={() => setIsModalOpen(true)}>
        手柄设置
      </Button>
      <Modal
        title="手柄设置"
        open={isModalOpen}
        onCancel={closeModal}
        footer={
          <Space>
            <Button color="magenta" variant="solid" onClick={reset}>
              默认
            </Button>
            <Button color="default" variant="solid" onClick={closeModal}>
              关闭
            </Button>
          </Space>
        }>
        <section className={style['_']}>
          <KeymapTable activeKey={activeKey} setActiveKey={setActiveKey} keymap={gamepadMap} />
          <section>
            <div>
              左摇杆死区：
              <InputNumber
                size="small"
                min={0}
                max={1}
                value={config.deadZone}
                onChange={(v) => onChange({ ...config, deadZone: +(v ?? 0) })}
                step={0.01}
              />
            </div>
            <div>
              设备选择：
              <Select
                size="small"
                popupMatchSelectWidth={false}
                value={config.indexOfGamepads}
                options={gamepads.map((g, k) => ({
                  value: k,
                  label: g.id,
                }))}
                onChange={(v) => {
                  onChange({ ...config, indexOfGamepads: v });
                }}
              />
            </div>
            <div>
              <label>
                按 Menu(菜单) 键清理输入历史：
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  checked={isClear}
                  onChange={setClear}
                />
              </label>
            </div>
          </section>
        </section>
      </Modal>
    </>
  );

  function closeModal(): void {
    setIsModalOpen(false);
    setActiveKey(undefined);
  }
  function reset(): void {
    onChange({
      deadZone: GamepadInput.DefaultLeftStickDeadZone,
      keymap: defGamepadMapArr,
      indexOfGamepads: 0,
    });
  }
  function getGamepads(): Gamepad[] {
    return navigator.getGamepads().filter(Boolean) as Gamepad[];
  }
}

export function useGamepadSettings(xboxInput: XboxGamepadInput, clearHistory: () => void) {
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

  const [isClear, setClear] = useLocalStorageState({
    storageKey: 'gpClearHistory',
    defaultValue: false,
  });
  useGamepadChange(
    isClear,
    (_leftStickDirect, buttons) => {
      // 按下 menu 键，清除输入历史
      if (buttons.find((v) => v.index === XboxGamepadInput.Keymap.Menu)) clearHistory();
    },
    gamepadConfig.indexOfGamepads,
    gamepadConfig.deadZone,
  );

  return { gamepadConfig, setGamepadConfig, isGamepadClear: isClear, setGamepadClear: setClear };
}
