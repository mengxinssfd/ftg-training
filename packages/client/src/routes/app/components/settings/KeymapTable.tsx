import style from './KeymapTable.module.scss';
import { type Keymap, type KeyOfKeymap, XboxGamepadInput } from '@core';
import { iconMap } from '@/common';
import { castArray, getClassNames } from '@tool-pack/basic';
import { Button } from 'antd';

export function KeymapTable({
  activeKey,
  setActiveKey,
  keymap,
}: {
  activeKey: KeyOfKeymap | undefined;
  setActiveKey: (key: KeyOfKeymap | undefined) => void;
  keymap: Keymap;
}): JSX.Element {
  return (
    <table className={style['_']}>
      <thead>
        <tr>
          <th scope="col">指令</th>
          <th scope="col">按键</th>
          <th scope="col">操作</th>
        </tr>
      </thead>
      <tbody>
        {keymap.map((val, key) => {
          const label = castArray(key)
            .map((v) => iconMap[v as keyof typeof iconMap] ?? v)
            .join(' + ');
          return (
            <tr key={label} className={getClassNames({ active: activeKey === key })}>
              <td>{label}</td>
              <td>{XboxGamepadInput.Keymap[val as keyof typeof XboxGamepadInput.Keymap] ?? val}</td>
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
