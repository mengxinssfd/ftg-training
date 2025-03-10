import { Input } from '../Input';
import { parserDirectsFromAxes } from '../../utils';
import type { Directs } from '../../enums';

export abstract class GamepadInput extends Input {
  private isDestroyed = false;
  protected override collectInputs(): Set<Directs> {
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
        const key = this.map[k];
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
    parserDirectsFromAxes([axes[0] as number, axes[1] as number]).forEach((d) =>
      this.directs.add(d),
    );
  }
  override destroy(): void {
    this.isDestroyed = true;
  }
}
