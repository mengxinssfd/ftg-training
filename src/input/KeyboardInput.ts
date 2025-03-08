import { Input } from './Input';

export class KeyboardInput extends Input {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private keydownListener(_e: KeyboardEvent): void {
    // 不能用箭头函数赋值，因为比 constructor 慢
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private keyupListener(_e: KeyboardEvent): void {
    // 不能用箭头函数赋值，因为比 constructor 慢
  }
  override addListener(): void {
    const kd = (this.keydownListener = (e): void => {
      this.onKey(e.key, 'add');
    });
    const ku = (this.keyupListener = (e): void => {
      this.onKey(e.key, 'delete');
    });
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
  }
  override destroy(): void {
    window.removeEventListener('keydown', this.keydownListener);
    window.removeEventListener('keyup', this.keyupListener);
  }
}
