import { Direct, Input } from '@core';
import type { Keymap } from '@core';
import styles from './HitBox.module.scss';
import { iconMap } from '@/common/iconMap';
import { OtherKeys } from '@/common/OtherKeys';
import { DynamicEnum } from '@tool-pack/basic';

function arrToObj(arr: (string | number)[]): Keymap {
  return arr.reduce((acc: Keymap, item: string | number) => {
    acc.set(item, item);
    return acc;
  }, new DynamicEnum(new Map()));
}
const list = [
  Direct.Up,
  Direct.Down,
  Direct.Left,
  Direct.Right,

  OtherKeys.LP,
  OtherKeys.MP,
  OtherKeys.HP,
  OtherKeys.LK,
  OtherKeys.MK,
  OtherKeys.HK,
];
const map = arrToObj(list);
export class HitBoxInput extends Input {
  constructor(socd: typeof HitBoxInput.prototype.socd) {
    super(map, socd);
  }
  HitBox = () => {
    return (
      <section
        className={styles['_']}
        onContextMenuCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}>
        {list.map((item) => {
          return (
            <button
              className={String(Direct[item as Direct] ?? item).toLowerCase()}
              key={item}
              onTouchCancel={() => {
                this.onKey(item, 'delete');
              }}
              onMouseUp={() => {
                this.onKey(item, 'delete');
              }}
              onTouchEnd={() => {
                this.onKey(item, 'delete');
              }}
              onMouseDown={() => {
                this.onKey(item, 'add');
              }}
              onTouchStart={() => {
                this.onKey(item, 'add');
              }}>
              {iconMap[item as Direct] ?? item}
            </button>
          );
        })}
      </section>
    );
  };
  override destroy(): void {
    //
  }
}
