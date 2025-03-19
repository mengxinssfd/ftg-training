import style from './GamepadSettings.module.scss';
import { gamepadMap, useGamepadChange } from '@/common';
import type { KeyOfKeymap } from '@core';
import { useState } from 'react';
import { Modal, Button, InputNumber } from 'antd';
import { KeymapTable } from '@/routes/app/components/settings/KeymapTable';

export function GamepadSettings({
  setDeadZone,
  deadZone,
}: {
  setDeadZone: (deadZone: number) => void;
  deadZone: number;
}): JSX.Element {
  const [activeKey, setActiveKey] = useState<KeyOfKeymap | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        footer={<Button onClick={closeModal}>关闭</Button>}>
        <section className={style['_']}>
          <div>
            左摇杆死区：
            <InputNumber
              min={0}
              max={1}
              defaultValue={deadZone}
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
  }
}
