import { Directs } from '../enums';
import type { InputHistory } from '../types';

export abstract class Input {
  // 注意：directs只接收上下左右四个正方向，斜方向不应该接收，否则 socd 不好处理，如果有斜方向应该录入两个正方向
  protected directs = new Set<Directs>();
  protected others = new Set<string>();
  constructor(
    protected map: Record<string, any>,
    protected socd?: (directs: Set<Directs>) => void,
  ) {}
  private isDirect(key: string | Directs) {
    const directs = [Directs.Up, Directs.Down, Directs.Left, Directs.Right];
    return directs.includes(key as Directs);
  }
  protected onKey(k: string | number, type: 'add' | 'delete'): void {
    const key = this.map[k];
    if (!key) return;
    if (this.isDirect(key)) {
      this.directs[type](key);
    } else {
      this.others[type](key);
    }
  }
  protected addKey(k: string | number): void {
    this.onKey(k, 'add');
  }
  getKeys(): Pick<InputHistory, 'direct' | 'others'> {
    const directs = new Set(this.directs);
    this.socd?.(directs);
    return { direct: this.transDirect(directs), others: [...this.others] };
  }
  private transDirect(d: Set<Directs>): Directs {
    if (d.has(Directs.Up)) {
      if (d.has(Directs.Left)) return Directs.UpLeft;
      if (d.has(Directs.Right)) return Directs.UpRight;
      return Directs.Up;
    }
    if (d.has(Directs.Down)) {
      if (d.has(Directs.Left)) return Directs.DownLeft;
      if (d.has(Directs.Right)) return Directs.DownRight;
      return Directs.Down;
    }
    if (d.has(Directs.Left)) return Directs.Left;
    if (d.has(Directs.Right)) return Directs.Right;
    return Directs.None;
  }
  protected clearInputs(): void {
    this.directs.clear();
    this.others.clear();
  }
  abstract destroy(): void;
  static union(inputs: Input[]): Pick<InputHistory, 'direct' | 'others'> {
    const first = inputs[0];
    if (!first) return { direct: Directs.None, others: [] };
    if (inputs.length === 1) return first.getKeys();
    const [directs, others] = inputs.reduce(
      (res, v) => [res[0].union(v.directs), res[1].union(v.others)],
      [new Set<Directs>(), new Set<string>()],
    );
    first.directs = directs;
    first.others = others;
    return first.getKeys();
  }
}
