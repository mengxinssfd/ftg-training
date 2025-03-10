import { Directs } from '../enums';
import type { InputResult, Keymap } from '../types';
import { transDirect4To8 } from '../utils';
import { castArray } from '@tool-pack/basic';

export abstract class Input {
  // 注意：directs只接收上下左右四个正方向，斜方向不应该接收，否则 socd 不好处理，如果有斜方向应该录入两个正方向
  protected directs = new Set<Directs>();
  protected others = new Set<string | number>();
  constructor(protected map: Keymap, protected socd?: (directs: Set<Directs>) => void) {}
  private isDirect(key: string | Directs): key is Directs {
    const directs = [Directs.Up, Directs.Down, Directs.Left, Directs.Right];
    return directs.includes(key as Directs);
  }
  protected onKey(k: string | number, type: 'add' | 'delete'): void {
    const keys = this.map[k];
    if (!keys) return;
    castArray(keys).forEach((key): void => {
      if (this.isDirect(key)) this.directs[type](key);
      else this.others[type](key);
    });
  }
  protected addKey(k: string | number): void {
    this.onKey(k, 'add');
  }
  getInputResult(): InputResult {
    return { direct: transDirect4To8(this.collectInputs()), others: [...this.others] };
  }
  protected clearInputs(): void {
    this.directs.clear();
    this.others.clear();
  }
  protected collectInputs(): Set<Directs> {
    const directs = new Set(this.directs);
    this.socd?.(directs);
    return directs;
  }
  abstract destroy(): void;
  static union(inputs: Input[]): InputResult {
    const first = inputs[0];
    if (!first) return { direct: Directs.None, others: [] };
    if (inputs.length === 1) return first.getInputResult();
    const [directs, others] = inputs.reduce(
      (res, v) => {
        return [res[0].union(v.collectInputs()), res[1].union(v.others)];
      },
      [new Set<Directs>(), new Set<string | number>()],
    );
    first.socd?.(directs);
    return { direct: transDirect4To8(directs), others: [...others] };
  }
}
