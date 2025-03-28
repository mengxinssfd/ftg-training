import style from './KeyboardSettings.module.scss';
import { defKeyboardMapArr, keyboardMap } from '@/common';
import { addKeyboardListener, type KeyOfKeymap, type MapArrayOfKeymap } from '@core';
import { useEffect, useState } from 'react';
import { Modal, Button, Space } from 'antd';
import { KeymapTable } from '@/routes/app/components/settings/KeymapTable';
import { preventDefaultEvent } from '@tool-pack/dom';

export interface KeyboardConfig {
  keymap: MapArrayOfKeymap;
}
export function KeyboardSettings({
  onChange,
}: {
  config: KeyboardConfig;
  onChange: (value: KeyboardConfig) => void;
}): JSX.Element {
  const [activeKey, setActiveKey] = useState<KeyOfKeymap | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect((): void | (() => void) => {
    if (activeKey === undefined) return;
    return addKeyboardListener(
      (keycode, _isPressed, e): boolean | void => {
        keyboardMap.setOrSwap(activeKey, keycode);
        setActiveKey(undefined);
        onChange({ keymap: keyboardMap.map((v, k) => [k, v]) });
        return e && preventDefaultEvent(e);
      },
      { capture: true },
    );
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
        footer={
          <Space>
            <Button color="green" variant="solid" onClick={reset}>
              默认
            </Button>
            <Button color="default" variant="solid" onClick={closeModal}>
              关闭
            </Button>
          </Space>
        }>
        <section className={style['_']}>
          <KeymapTable activeKey={activeKey} setActiveKey={setActiveKey} keymap={keyboardMap} />
        </section>
      </Modal>
    </>
  );
  function closeModal(): void {
    setIsModalOpen(false);
    setActiveKey(undefined);
  }
  function reset(): void {
    onChange({ keymap: defKeyboardMapArr });
  }
}
