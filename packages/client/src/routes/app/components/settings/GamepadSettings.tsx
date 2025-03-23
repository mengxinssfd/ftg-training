import style from './GamepadSettings.module.scss';
import {
  defGamepadMapArr,
  gamepadMap,
  gamepadStorageKey,
  resetKeymap,
  resetKeymapWithSaved,
  saveKeymap,
} from '@/common';
import type { GamepadInput, KeyOfKeymap } from '@core';
import { useEffect, useState } from 'react';
import { Button, InputNumber, Modal, Space } from 'antd';
import { KeymapTable } from '@/routes/app/components/settings/KeymapTable';
import { useGamepadChange } from '@/hooks';

let initDeadZone = -1;
const deadZoneKey = 'deadZone';
export function GamepadSettings({ gamepadInput }: { gamepadInput: GamepadInput }): JSX.Element {
  const [activeKey, setActiveKey] = useState<KeyOfKeymap | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadZone, setDeadZone] = useState(loadDeadZone);

  useEffect(() => {
    initDeadZone = gamepadInput.leftStickDeadZone;
  }, []);
  useEffect(() => {
    gamepadInput.leftStickDeadZone = deadZone;
  }, [deadZone]);

  useGamepadChange(
    activeKey !== undefined,
    0,
    (_leftStickDirect, buttons) => {
      const btn = buttons[0];
      if (!btn || activeKey === undefined) return;
      gamepadMap.setOrSwap(activeKey, btn.index);
      setActiveKey(undefined);
    },
    deadZone,
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
            <Button color="green" variant="solid" onClick={reset}>
              还愿为默认
            </Button>
            <Button color="pink" variant="solid" onClick={resetWithSaved}>
              还原为已保存
            </Button>
            <Button type="primary" onClick={save}>
              保存
            </Button>
            <Button color="default" variant="solid" onClick={closeModal}>
              关闭
            </Button>
          </Space>
        }>
        <section className={style['_']}>
          <div>
            左摇杆死区：
            <InputNumber
              min={0}
              max={1}
              value={deadZone}
              onChange={(v) => setDeadZone(+(v ?? 0))}
              step={0.01}
            />
          </div>
          <KeymapTable activeKey={activeKey} setActiveKey={setActiveKey} keymap={gamepadMap} />
        </section>
      </Modal>
    </>
  );

  function closeModal(): void {
    setIsModalOpen(false);
    resetWithSaved();
  }
  function save(): void {
    saveKeymap(gamepadMap, gamepadStorageKey);
    saveDeadZone();
    setIsModalOpen(false);
  }
  function reset(): void {
    resetKeymap(gamepadMap, defGamepadMapArr);
    setDeadZone(initDeadZone);
  }
  function resetWithSaved(): void {
    resetKeymapWithSaved(gamepadMap, gamepadStorageKey, defGamepadMapArr);
    setDeadZone(loadDeadZone());
  }
  function saveDeadZone(): void {
    localStorage.setItem(deadZoneKey, JSON.stringify(gamepadInput.leftStickDeadZone));
  }
  function loadDeadZone(): number {
    return +(localStorage.getItem(deadZoneKey) || gamepadInput.leftStickDeadZone);
  }
}
