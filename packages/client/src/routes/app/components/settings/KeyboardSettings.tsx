import style from './KeyboardSettings.module.scss';
import {
  defKeyboardMapArr,
  keyboardMap,
  keyboardStorageKey,
  resetKeymap,
  resetKeymapWithSaved,
  saveKeymap,
} from '@/common';
import type { KeyOfKeymap } from '@core';
import { useEffect, useState } from 'react';
import { Modal, Button, Space } from 'antd';
import { KeymapTable } from '@/routes/app/components/settings/KeymapTable';
import { preventDefaultEvent } from '@tool-pack/dom';

export function KeyboardSettings(): JSX.Element {
  const [activeKey, setActiveKey] = useState<KeyOfKeymap | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect((): void | (() => void) => {
    if (activeKey === undefined) return;
    const handler = (e: KeyboardEvent): boolean => {
      keyboardMap.setOrSwap(activeKey, e.code);
      setActiveKey(undefined);
      return preventDefaultEvent(e);
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
        footer={
          <Space>
            <Button
              color="green"
              variant="solid"
              onClick={() => resetKeymap(keyboardMap, defKeyboardMapArr)}>
              还愿为默认
            </Button>
            <Button color="pink" variant="solid" onClick={resetKeyboardMapWithSaved}>
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
          <KeymapTable activeKey={activeKey} setActiveKey={setActiveKey} keymap={keyboardMap} />
        </section>
      </Modal>
    </>
  );

  function closeModal(): void {
    setIsModalOpen(false);
    resetKeyboardMapWithSaved();
  }
  function save(): void {
    saveKeymap(keyboardMap, keyboardStorageKey);
    setIsModalOpen(false);
  }
  function resetKeyboardMapWithSaved(): void {
    resetKeymapWithSaved(keyboardMap, keyboardStorageKey, defKeyboardMapArr);
  }
}
