import { Input } from './Input';
import type { Keymap, SOCD } from '../types';

export class KeyboardInput extends Input {
  constructor(protected override map: Keymap, protected override socd?: SOCD) {
    super(map, socd);
    this.addListener();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private keydownListener(_e: KeyboardEvent): void {
    // 不能用箭头函数赋值，因为比 constructor 慢
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private keyupListener(_e: KeyboardEvent): void {
    // 不能用箭头函数赋值，因为比 constructor 慢
  }
  addListener(): void {
    const kd = (this.keydownListener = (e): void => {
      this.onKey(e.code, 'add');
    });
    const ku = (this.keyupListener = (e): void => {
      this.onKey(e.code, 'delete');
    });
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
  }
  override destroy(): void {
    window.removeEventListener('keydown', this.keydownListener);
    window.removeEventListener('keyup', this.keyupListener);
  }
}
