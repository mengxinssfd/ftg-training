import { Input } from '../Input';
import { parserDirectsFromAxes } from '../../utils';
import type { Direct } from '../../enums';

export abstract class GamepadInput extends Input {
  private isDestroyed = false;
  leftStickDeadZone = 0.05;
  protected override collectInputs(): Map<Direct, number> {
    if (!this.isDestroyed) {
      const gamepads = navigator.getGamepads();
      // 获取第一个手柄
      const gp = gamepads[0];
      if (!gp) return super.collectInputs();
      // 清理输入记录
      this.clearInputs();
      // 读取按钮状态
      gp.buttons.forEach((btn, k) => {
        if (!btn.pressed) return;
        const key = this.map.getKeyByValue(k);
        key && this.addKey(k);
        // const btnName = keyMaps[k] as string;
        // console.log(`按钮 ${btnName} 被按下`, key, btn.value);
      });
      // 读取轴状态
      this.transAxes(gp.axes);
    }
    return super.collectInputs();
  }
  protected transAxes(axes: readonly number[]): void {
    const now = Date.now();
    parserDirectsFromAxes([axes[0] as number, axes[1] as number], this.leftStickDeadZone).forEach(
      (d) => this.directs.set(d, now),
    );
  }
  override destroy(): void {
    this.isDestroyed = true;
  }
}
