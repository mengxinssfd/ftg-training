import style from './KeyboardSettings.module.scss';
import { iconMap, keyboardMap } from '@/common';
import { castArray, getClassNames, isObject } from '@tool-pack/basic';
import { JSX, useEffect, useState } from 'react';
import { Modal, Button } from 'antd';

export function KeyboardSettings(): JSX.Element {
  const [activeKey, setActiveKey] = useState<unknown>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (activeKey === undefined) return;
    const handler = (e: KeyboardEvent) => {
      keyboardMap.set(activeKey, e.code);
      setActiveKey(undefined);
      e.stopPropagation();
      e.preventDefault();
      return false;
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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
  activeKey: unknown;
  setActiveKey: (key: unknown) => void;
}): JSX.Element {
  const list: JSX.Element[] = [];
  keyboardMap.forEach((val, key) => {
    const label = castArray(key)
      .map((v) => (isObject<{ name: string }>(v) ? v.name : iconMap[v] ?? v))
      .join(' + ');
    list.push(
      <tr key={label} className={getClassNames({ active: activeKey === key })}>
        <td>{label}</td>
        <td>{val.replace('Key', '')}</td>
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
