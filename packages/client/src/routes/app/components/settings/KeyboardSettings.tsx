import style from './KeyboardSettings.module.scss';
import { defKeyboardMapArr, keyboardMap, resetKeymap } from '@/common';
import { addKeyboardListener, type KeyOfKeymap, type MapArrayOfKeymap } from '@core';
import { useEffect, useState } from 'react';
import { Modal, Button, Space, Switch } from 'antd';
import { KeymapTable } from '@/routes/app/components/settings/KeymapTable';
import { preventDefaultEvent } from '@tool-pack/dom';
import { useLocalStorageState } from '@/hooks';

export interface KeyboardConfig {
  keymap: MapArrayOfKeymap;
}
export function KeyboardSettings({
  onChange,
  isClear,
  setClear,
}: {
  onChange: (value: KeyboardConfig) => void;
  isClear: boolean;
  setClear: (value: boolean) => void;
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
          <div>
            <label>
              按 esc 键清理输入历史：
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                checked={isClear}
                onChange={setClear}
              />
            </label>
          </div>
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

export function useKeyboardSettings(clearHistory: () => void) {
  const [, /* keyboardConfig, */ setKeyboardConfig] = useLocalStorageState({
    storageKey: 'keyboardConfig',
    defaultValue: (): KeyboardConfig => ({ keymap: defKeyboardMapArr }),
    onChange: (v): void => resetKeymap(keyboardMap, v.keymap),
  });

  const [isClear, setClear] = useLocalStorageState({
    storageKey: 'kbClearHistory',
    defaultValue: false,
  });
  useEffect(() => {
    if (!isClear) return;
    return addKeyboardListener((keycode, isPressed): boolean | void => {
      if (keycode === 'Escape' && isPressed) {
        clearHistory();
      }
    });
  }, [isClear]);

  return { isKeyboardClear: isClear, setKeyboardClear: setClear, setKeyboardConfig };
}
