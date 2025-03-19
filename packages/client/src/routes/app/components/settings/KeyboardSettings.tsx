import style from './KeyboardSettings.module.scss';
import { iconMap, keyboardMap } from '@/common';
import type { KeyOfKeymap } from '@core';
import { castArray, getClassNames, isObject } from '@tool-pack/basic';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';

export function KeyboardSettings(): JSX.Element {
  const [activeKey, setActiveKey] = useState<KeyOfKeymap | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect((): void | (() => void) => {
    if (activeKey === undefined) return;
    const handler = (e: KeyboardEvent): boolean => {
      keyboardMap.setOrSwap(activeKey, e.code);
      setActiveKey(undefined);
      e.stopPropagation();
      e.preventDefault();
      return false;
    };
    const eventType = 'keydown';
    const options = { capture: true };
    window.addEventListener(eventType, handler, options);
    return (): void => {
      window.removeEventListener(eventType, handler, options);
    };
  }, [activeKey]);

  return (
    <>
      <Button size="small" onClick={() => setIsModalOpen(true)}>
        键盘设置
      </Button>
      <Modal
        title="键盘设置"
        open={isModalOpen}
        onCancel={closeModal}
        footer={<Button onClick={closeModal}>关闭</Button>}>
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
  activeKey: KeyOfKeymap | undefined;
  setActiveKey: (key: KeyOfKeymap | undefined) => void;
}): JSX.Element {
  const list: JSX.Element[] = [];
  keyboardMap.forEach((val, key) => {
    const label = castArray(key)
      .map((v) =>
        isObject<{ name: string }>(v) ? v.name : iconMap[v as keyof typeof iconMap] ?? v,
      )
      .join(' + ');
    list.push(
      <tr key={label} className={getClassNames({ active: activeKey === key })}>
        <td>{label}</td>
        <td>{String(val || '').replace('Key', '')}</td>
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
