import style from './GamepadSettings.module.scss';
import { gamepadMap, iconMap, useGamepadChange } from '@/common';
import { castArray, getClassNames, isObject } from '@tool-pack/basic';
import { useState } from 'react';
import { Modal, Button, InputNumber } from 'antd';
import { XboxGamepadInput } from '@core';

export function GamepadSettings({
  setDeadZone,
  deadZone,
}: {
  setDeadZone: (deadZone: number) => void;
  deadZone: number;
}): JSX.Element {
  const [activeKey, setActiveKey] = useState<unknown>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useGamepadChange(
    activeKey !== undefined,
    0,
    (leftStickDirect, buttons) => {
      const btn = buttons[0];
      if (!btn) return;
      gamepadMap.set(activeKey, btn.index);
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
        <div>
          左摇杆死区：
          <InputNumber min={0} max={1} defaultValue={deadZone} onChange={setDeadZone} step={0.01} />
        </div>
        <table className={style['_']}>
          <thead>
            <tr>
              <th scope="col">指令</th>
              <th scope="col">按键</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <Tbody activeKey={activeKey} setActiveKey={setActiveKey} />
        </table>
      </Modal>
    </>
  );

  function closeModal(): void {
    setIsModalOpen(false);
  }
}

function Tbody({
  activeKey,
  setActiveKey,
}: {
  activeKey: unknown;
  setActiveKey: (key: unknown) => void;
}): JSX.Element {
  const list: JSX.Element[] = [];
  gamepadMap.forEach((val, key) => {
    const label = castArray(key)
      .map((v) => (isObject<{ name: string }>(v) ? v.name : iconMap[v] ?? v))
      .join(' + ');
    list.push(
      <tr key={label} className={getClassNames({ active: activeKey === key })}>
        <td>{label}</td>
        <td>{XboxGamepadInput.Keymap[val] ?? val}</td>
        <td>
          {activeKey !== key ? (
            <Button
              color="default"
              variant="filled"
              autoInsertSpace={false}
              size="small"
              onClick={() => setActiveKey(key)}>
              更改
            </Button>
          ) : (
            <Button
              color="cyan"
              variant="solid"
              autoInsertSpace={false}
              size="small"
              onClick={() => setActiveKey(undefined)}>
              取消
            </Button>
          )}
        </td>
      </tr>,
    );
  });
  return <tbody>{list}</tbody>;
}
