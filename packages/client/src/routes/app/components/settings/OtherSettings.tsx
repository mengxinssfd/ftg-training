import style from './OtherSettings.module.scss';
import { useState } from 'react';
import { Button, Modal, Select, Space, Switch } from 'antd';
import { PlayerLocation } from '@core';

export function OtherSettings({
  config,
  onChange,
  clearInputs,
}: {
  config: OtherConfig;
  onChange: (value: OtherConfig) => void;
  clearInputs: () => void;
}): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setIsModalOpen(true)}>
        设置
      </Button>
      <Modal
        title="设置"
        open={isModalOpen}
        onCancel={closeModal}
        footer={
          <Space>
            <Button onClick={clearInputs}>清理输入历史</Button>
            <Button color="default" variant="solid" onClick={closeModal}>
              关闭
            </Button>
          </Space>
        }>
        <section className={style['_']}>
          <section>
            <div>
              <label>
                SOCD：
                <Select
                  size="small"
                  value={config.socd}
                  onChange={changeConfig('socd')}
                  options={socds}></Select>
              </label>
            </div>
            <div>
              <label>
                主题：
                <Select
                  size="small"
                  value={config.theme}
                  onChange={changeConfig('theme')}
                  options={themes.map((t) => ({ value: t, label: t }))}
                />
              </label>
            </div>
            <div>
              <label>
                站位：
                <Select
                  size="small"
                  value={config.location}
                  onChange={changeConfig('location')}
                  options={locations}></Select>
              </label>
            </div>
            <div>
              <label>
                输入历史位置：
                <Switch
                  checkedChildren="垂直"
                  unCheckedChildren="水平"
                  checked={config.inputHistory.layout === 'vertical'}
                  onChange={(c) =>
                    changeConfigObj('inputHistory')('layout')(c ? 'vertical' : 'horizontal')
                  }
                />
              </label>
            </div>
            <div>
              <label>
                出招表：
                <Switch
                  checkedChildren="显示"
                  unCheckedChildren="隐藏"
                  checked={config.visibles.skillList}
                  onChange={changeConfigObj('visibles')('skillList')}
                />
              </label>
            </div>
            <div>
              <label>
                虚拟HitBox：
                <Switch
                  checkedChildren="显示"
                  unCheckedChildren="隐藏"
                  checked={config.visibles.hitbox}
                  onChange={changeConfigObj('visibles')('hitbox')}
                />
              </label>
            </div>
            <div>
              <label>
                输入映射：
                <Switch
                  checkedChildren="显示"
                  unCheckedChildren="隐藏"
                  checked={config.visibles.inputViewer}
                  onChange={changeConfigObj('visibles')('inputViewer')}
                />
              </label>
            </div>
            <div>
              <label>
                搓招识别：
                <Switch
                  checkedChildren="显示"
                  unCheckedChildren="隐藏"
                  checked={config.visibles.skillMatch}
                  onChange={changeConfigObj('visibles')('skillMatch')}
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
  }
  function changeConfig<K extends keyof OtherConfig>(k: K) {
    return (v: OtherConfig[K]): void => {
      onChange({ ...config, [k]: v });
    };
  }
  function changeConfigObj<K extends keyof OtherConfig>(k: K) {
    return function getObjK<OK extends keyof OtherConfig[K]>(objK: OK) {
      return (v: OtherConfig[K][OK]): void => {
        const obj = config[k];
        if (typeof obj !== 'object') return;
        onChange({ ...config, [k]: { ...obj, [objK]: v } });
      };
    };
  }
}

export interface OtherConfig {
  socd: 'socdN' | 'socdLW' | 'socdFW';
  theme: Theme;
  location: PlayerLocation;
  inputHistory: {
    layout: 'vertical' | 'horizontal';
    only: boolean;
  };
  visibles: {
    skillList: boolean;
    hitbox: boolean;
    inputViewer: boolean;
    skillMatch: boolean;
  };
}
type Theme = 'light' | 'dark' | 'dark-transparent';
export const themes: Theme[] = ['light', 'dark', 'dark-transparent'];
const locations = [
  { value: PlayerLocation.Left, label: '1P' },
  { value: PlayerLocation.Right, label: '2P' },
];
const socds = [
  { value: 'socdN', label: '对向回中' },
  { value: 'socdFW', label: '前覆盖' },
  { value: 'socdLW', label: '后覆盖' },
];
