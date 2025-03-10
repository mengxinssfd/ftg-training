import { Input } from './input';
import type { InputHistory, InputResult } from './types';
import type { PlayerLocation } from './enums';

export class InputManager {
  private historyLen = 20000;
  frame = 0;
  inputHistory: InputHistory[] = [];
  constructor(private inputs: Input[]) {}
  frameAdd(location: PlayerLocation, frame: number): void {
    this.frame = frame;
    const input = Input.union(this.inputs);
    if (this.isSameInput(input)) return;
    this.inputHistory.push({ ...input, startFrame: this.frame, location: location });
    if (this.inputHistory.length >= this.historyLen) {
      this.inputHistory.splice(0, this.inputHistory.length - this.historyLen);
    }
  }
  private isSameInput(input: InputResult): boolean {
    const lastInput = this.inputHistory.at(-1);
    if (!lastInput) return false;
    return (
      input.direct === lastInput.direct &&
      lastInput.others.length === input.others.length &&
      lastInput.others.every((v, k) => v === input.others[k])
    );
  }
  clear() {
    this.inputHistory.length = 0;
  }
  setHistoryLen(length: number) {
    this.historyLen = length;
  }
}
