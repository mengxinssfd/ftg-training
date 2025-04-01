import { Direct, Input } from '@core';
import type { Keymap } from '@core';
import styles from './HitBox.module.scss';
import { OtherKeys } from '@/common/OtherKeys';
import { DynamicEnum } from '@tool-pack/basic';
import { HitBox as Hitbox } from './HitBox';

function arrToObj(arr: (string | number)[]): Keymap {
  return arr.reduce((acc: Keymap, item: string | number) => {
    acc.set(item, item);
    return acc;
  }, new DynamicEnum(new Map()));
}
const list = [
  Direct.Left,
  Direct.Down,
  Direct.Right,
  Direct.Up,

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
        <Hitbox
          onInput={(input) => {
            const lastDirects = this.directs;
            this.directs = new Map();
            this.clearInputs();
            input.forEach((i) => {
              const v = list[i] as number | string;
              if (this.isDirect(v)) {
                if (lastDirects.has(v)) {
                  this.directs.set(v, lastDirects.get(v) as number);
                }
              }
              this.addKey(v);
            });
          }}
        />
      </section>
    );
  };
  override destroy(): void {
    //
  }
}
