import { Input } from './Input';
import { addKeyboardListener } from '../utils';

export class KeyboardInput extends Input {
  protected override init() {
    super.init();
    this.addListener();
  }
  private addListener(): void {
    this.cancelers.push(
      addKeyboardListener((keycode, isPressed) => {
        this.onKey(keycode, isPressed ? 'add' : 'delete');
      }),
    );
  }
}
