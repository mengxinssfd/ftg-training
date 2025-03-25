import style from './GamepadSettings.module.scss';
import { defGamepadMapArr, gamepadMap } from '@/common';
import { GamepadInput, type KeyOfKeymap, type MapArrayOfKeymap } from '@core';
import { useEffect, useState } from 'react';
import { Button, InputNumber, Modal, Select, Space } from 'antd';
import { KeymapTable } from '@/routes/app/components/settings/KeymapTable';
import { useGamepadChange } from '@/hooks';

export interface GamepadConfig {
  deadZone: number;
  indexOfGamepads: number;
  keymap: MapArrayOfKeymap;
}
export function GamepadSettings({
  config,
  onChange,
}: {
  config: GamepadConfig;
  onChange: (value: GamepadConfig) => void;
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
