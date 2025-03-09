import { GamepadInput } from './GamepadInput';

// 0-15是xbox手柄的按键在gamepad.buttons的下标位置
enum XboxKeyMaps {
  A = 0,
  B,
  X,
  Y,
  LB,
  RB,
  LT,
  RT,
  View,
  Menu,
  LS,
  RS,
  Up,
  Down,
  Left,
  Right,
}
export class XboxGamepadInput extends GamepadInput {
  static readonly Keymap = XboxKeyMaps;
}
