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
  protected override transAxes(axes: readonly number[]): void {
    super.transAxes(axes);
    // console.log(`轴状态: ${axes}`);
    // 蓝牙模式下有 10 个轴，
    // 第一和第二跟 xbox 一样
    // 第 3 是右摇杆 x 轴
    // 第 4 是右扳机键，默认为-1,最大值为 1
    // 第 5 是左扳机键，
    // 第 6 是右摇杆 y 轴
    // 789 不知道
    // 第 10 是十字键，蓝牙手柄的十字键不是在 buttons 上
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
