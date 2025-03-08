import { GamepadInput } from './GamepadInput';

enum keyMaps {
  A = 0,
  B,
  P1,
  X,
  Y,
  P2,
  LB,
  RB,
  LT,
  RT,
  View,
  Menu,
  Home,
  LS,
  RS,
  Up = 10000,
  Down,
  Left,
  Right,
}
export class BluetoothGamepadInput extends GamepadInput {
  static readonly Keymap = keyMaps;
  protected override updateGamepad(): void {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];
    if (!gp) return;
    this.clearInputs();
    // 读取按钮状态
    gp.buttons.forEach((btn, k) => {
      if (!btn.pressed) return;
      const btnName = keyMaps[k] as string;
      const key = this.map[k];
      key && this.addKey(k);
      console.log(`按钮 ${btnName} 被按下`, key, btn.value);
    });
    // 读取轴状态
    this.transAxes(gp.axes);
  }
  protected override transAxes(axes: readonly number[]): void {
    // console.log(`轴状态: ${axes}`);
    // 蓝牙模式下有 10 个轴，
    // 第一和第二跟 xbox 一样
    // 第 3 是右摇杆 x 轴
    // 第 4 是右扳机键，默认为-1,最大值为 1
    // 第 5 是左扳机键，
    // 第 6 是右摇杆 y 轴
    // 789 不知道
    // 第 10 是十字键，蓝牙手柄的十字键不是在 buttons 上

    // 不要右摇杆的值
    const [x, y] = axes as [number, number];
    // todo 识别斜方向
    if (x === -1) {
      this.addKey(keyMaps.Left);
    } else if (x === 1) {
      this.addKey(keyMaps.Right);
    }
    if (y === -1) {
      this.addKey(keyMaps.Up);
    } else if (y === 1) {
      this.addKey(keyMaps.Down);
    }

    this.transCrossAxes(axes[9] as number);
  }
  private transCrossAxes(value: number): void {
    // 默认值是3.2857141494750977，up 是-1、right 是-0.4285714030265808、down 是0.14285719394683838、left 是0.7142857313156128
    switch (value) {
      case -1:
        this.addKey(keyMaps.Up);
        break;
      case -0.4285714030265808:
        this.addKey(keyMaps.Right);
        break;
      case 0.14285719394683838:
        this.addKey(keyMaps.Down);
        break;
      case 0.7142857313156128:
        this.addKey(keyMaps.Left);
        break;
      case -0.1428571343421936:
        this.addKey(keyMaps.Right);
        this.addKey(keyMaps.Down);
        break;
      case -0.7142857313156128:
        this.addKey(keyMaps.Right);
        this.addKey(keyMaps.Up);
        break;
      case 1:
        this.addKey(keyMaps.Left);
        this.addKey(keyMaps.Up);
        break;
      case 0.4285714626312256:
        this.addKey(keyMaps.Left);
        this.addKey(keyMaps.Down);
        break;
    }
  }
}
