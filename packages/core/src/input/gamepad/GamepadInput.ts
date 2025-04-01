import { Input } from '../Input';
import { parserDirectsFromAxes } from '../../utils';
import type { Direct } from '../../enums';

export abstract class GamepadInput extends Input {
  static readonly DefaultLeftStickDeadZone = 0.05;
  leftStickDeadZone = GamepadInput.DefaultLeftStickDeadZone;
  indexOfGamepads = 0;
  static getGamepad(index: number): Gamepad | null | undefined {
    const gamepads = navigator.getGamepads();
    return gamepads[index] ?? gamepads[0];
  }
  protected override collectInputs(): Map<Direct, number> {
    if (!this.isDestroyed) {
      // 获取手柄
      const gp = GamepadInput.getGamepad(this.indexOfGamepads);
      if (!gp) return super.collectInputs();
      // 读取按钮状态
      gp.buttons.forEach((btn, k) => {
        if (!btn.pressed) return;
        const key = this.map.getKeyByValue(k);
        if (!key) return;
        this.onKey(k, btn.pressed ? 'add' : 'delete');
        // const btnName = keyMaps[k] as string;
        // console.log(`按钮 ${btnName} 被按下`, key, btn.value);
      });
      // 读取轴状态
      this.transAxes(gp.axes);
    }
    return super.collectInputs();
  }
  protected transAxes(axes: readonly number[]): void {
    const directs = parserDirectsFromAxes(
      [axes[0] as number, axes[1] as number],
      this.leftStickDeadZone,
    );
    directs.forEach((d) => this.directs.has(d) && this.addKey(d));
    this.directs.forEach((d) => !directs.includes(d) && this.directs.delete(d));
  }
}
