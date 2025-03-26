import { Input } from './Input';
import type { Keymap, SOCD } from '../types';
import { addKeyboardListener } from '../utils';

export class KeyboardInput extends Input {
  constructor(protected override map: Keymap, protected override socd?: SOCD) {
    super(map, socd);
    this.addListener();
  }
  addListener(): void {
    this.cancelers.push(
      addKeyboardListener((keycode, isPressed) => {
        this.onKey(keycode, isPressed ? 'add' : 'delete');
      }),
    );
  }
}
