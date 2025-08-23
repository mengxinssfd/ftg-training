import { useEffect } from 'react';
import { Direct, GamepadInput, parseDirectsFromAxes, transDirect4To8 } from '@core';

interface Button {
  index: number;
  value: number;
}
export function useGamepadChange(
  active: boolean,
  onChange: (leftStickDirect: Direct, buttons: Button[]) => void,
  index = 0,
  deadZone = 0.05,
): void {
  useEffect(() => {
    let running = active;
    if (!running) return;
    const lastInput: { buttons: Button[]; direct: Direct } = { buttons: [], direct: Direct.None };
    requestAnimationFrame(function cb(): void {
      const gp = GamepadInput.getGamepad(index);
      if (gp) {
        // 读取按钮状态
        const buttons: Button[] = [];
        gp.buttons.forEach((btn, index) => {
          if (!btn.pressed) return;
          buttons.push({ index, value: btn.value });
        });
        // 读取轴状态
        const directs = parseDirectsFromAxes(gp.axes as [number, number], deadZone);
        const direct = transDirect4To8(new Set(directs));

        if (!isSameInput(direct, buttons)) {
          onChange(direct, buttons);
        }

        lastInput.direct = direct;
        lastInput.buttons = buttons;
      }
      if (running) requestAnimationFrame(cb);
    });
    return () => {
      running = false;
    };

    function isSameInput(direct: Direct, buttons: Button[]): boolean {
      if (direct !== lastInput.direct) return false;
      if (buttons.length !== lastInput.buttons.length) return false;
      return lastInput.buttons.every((v, i) => {
        const btn = buttons[i] as Button;
        return v.index === btn.index && v.value === btn.value;
      });
    }
  }, [index, deadZone, active]);
}
