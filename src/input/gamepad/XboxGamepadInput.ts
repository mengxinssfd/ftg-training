import { GamepadInput } from './GamepadInput';

// 0-15是xbox手柄的按键在gamepad.buttons的下标位置
enum xboxKeyMaps {
  A = 0,
  B,
  X,
  Y,
  LB,
  RB,
  LT,
  RT,
  Back,
  Start,
  LS,
  RS,
  Up,
  Down,
  Left,
  Right,
}
export class XboxGamepadInput extends GamepadInput {
  static readonly keymap = xboxKeyMaps;
  protected override updateGamepad(): void {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];
    if (!gp) return;
    this.clearInputs();
    // 读取按钮状态
    gp.buttons.forEach((btn, k) => {
      if (!btn.pressed) return;
      const btnName = xboxKeyMaps[k] as string;
      const key = this.map[k];
      key && this.addKey(k);
      console.log(`按钮 ${btnName} 被按下`, key);
    });
    // 读取轴状态
    this.transAxes(gp.axes);
  }
  protected override transAxes(axes: readonly number[]): void {
    console.log(`轴状态: ${axes}`);
    // xbox 的轴有4个值
    // 第一个是左摇杆的x轴，左是-1，右是1
    // 第二个是左摇杆的y轴，上是-1，下是1
    // 后面两个是右摇杆，和左摇杆一样

    // 不要右摇杆的值
    const [x, y] = axes as [number, number];
    // todo 识别斜方向
    if (x === -1) {
      this.addKey(xboxKeyMaps.Left);
    } else if (x === 1) {
      this.addKey(xboxKeyMaps.Right);
    }
    if (y === -1) {
      this.addKey(xboxKeyMaps.Up);
    } else if (y === 1) {
      this.addKey(xboxKeyMaps.Down);
    }
  }
}
