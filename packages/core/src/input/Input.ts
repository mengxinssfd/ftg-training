import { Direct } from '../enums';
import type { InputHandler, InputResult, Keymap, SOCD, ValueOfKeymap } from '../types';
import { castArray } from '@tool-pack/basic';
import { DirectCollector } from './DirectCollector';

export abstract class Input {
  // 注意：directs只接收上下左右四个正方向，斜方向不应该接收，否则 socd 不好处理，如果有斜方向应该录入两个正方向
  protected directs = new DirectCollector();
  protected others = new Set<ValueOfKeymap>();
  protected cancelers: (() => void)[] = [];
  protected isDestroyed = false;
  constructor(protected map: Keymap, protected socd?: SOCD, protected inputHandler?: InputHandler) {
    this.init();
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected init(): void {}
  protected onKey(k: string | number, type: 'add' | 'delete'): void {
    const keys = this.map.getKeyByValue(k);
    if (!keys) return;
    castArray(keys).forEach((key): void => {
      if (DirectCollector.isDirect(key)) {
        if (type === 'delete') this.directs.delete(key);
        else {
          if (!this.directs.has(key)) this.directs.set(key, Date.now());
        }
      } else this.others[type](key as string | number);
    });
  }
  protected addKey(k: string | number): void {
    this.onKey(k, 'add');
  }
  protected clearInputs(): void {
    this.clearDirects();
    this.clearOthers();
  }
  protected clearOthers(): void {
    this.others.clear();
  }
  protected clearDirects(): void {
    this.directs.clear();
  }
  protected collectDirects(): DirectCollector {
    const directs = new DirectCollector(this.directs);
    this.socd?.(directs);
    return directs;
  }
  protected removeCanceller(canceler: () => void): void {
    const index = this.cancelers.findIndex(canceler);
    if (index >= 0) {
      this.cancelers.splice(index, 1);
    }
  }
  destroy(): void {
    this.cancelers.forEach((cb) => cb());
    this.cancelers.length = 0;
    this.isDestroyed = true;
  }
  static union(inputs: Input[]): InputResult {
    const first = inputs[0];
    if (!first) return { direct: Direct.None, others: [] };
    const [directs, others] = inputs.reduce(
      (res, v) => [res[0].union(v.collectDirects()), res[1].union(v.others)],
      [new DirectCollector(), new Set<string | number>()],
    );
    first.socd?.(directs);
    first.inputHandler?.(directs, others);
    return { direct: directs.toDirect(), others: [...others] };
  }
}
