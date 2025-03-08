import { Input } from './Input';
import type { InputHistory } from '../types';

export class GamepadInput extends Input {
  updateGamepad(): void {
    this.clearInputs();
    const gamepads = navigator.getGamepads();
    if (gamepads) {
      const gp = gamepads[0];
      if (gp) {
        console.log(gp);
        // 读取按钮状态
        gp.buttons.forEach((btn, i) => {
          if (btn.pressed) {
            const key = this.map[btn.value];
            key && this.onKey(key, 'add');
            console.log(`按钮 ${i} 被按下`);
          }
        });
        // 读取轴状态
        const axes = gp.axes;
        console.log(`轴状态: ${axes}`);
      }
    }
  }
  override getKeys(): Pick<InputHistory, 'direct' | 'others'> {
    this.updateGamepad();
    return super.getKeys();
  }
}
