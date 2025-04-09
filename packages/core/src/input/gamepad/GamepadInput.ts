import { Input } from '../Input';
import { parserDirectsFromAxes } from '../../utils';
import { DirectCollector } from '../DirectCollector';

export abstract class GamepadInput extends Input {
  static readonly DefaultLeftStickDeadZone = 0.05;
  leftStickDeadZone = GamepadInput.DefaultLeftStickDeadZone;
  indexOfGamepads = 0;
  private axesDirects = new DirectCollector();
  static getGamepad(index: number): Gamepad | null | undefined {
    const gamepads = navigator.getGamepads();
    return gamepads[index] ?? gamepads[0];
  }
  protected override collectDirects(): DirectCollector {
    if (!this.isDestroyed) {
      // 获取手柄
      const gp = GamepadInput.getGamepad(this.indexOfGamepads);
      if (!gp) return super.collectDirects();
      this.clearOthers();
      // 读取按钮状态
      gp.buttons.forEach((btn, k) => {
        const key = this.map.getKeyByValue(k);
        if (DirectCollector.isDirect(key)) {
          this.onKey(k, btn.pressed ? 'add' : 'delete');
          return;
        }
        btn.pressed && this.addKey(k);
      });
      // 读取轴状态
      this.transAxes(gp.axes);
    }
    return super.collectDirects();
  }
  protected transAxes(axes: readonly number[]): void {
    // 转换小摇杆方向
    const directs = parserDirectsFromAxes(
      [axes[0] as number, axes[1] as number],
      this.leftStickDeadZone,
    );
    // 合并新旧方向
    this.axesDirects.updateWithDirects(directs);
    // 合并小摇杆和十字键的方向
    this.directs.innerUnion(this.axesDirects);
  }
}
