import { Input } from './input';
import type { InputHistory, InputResult } from './types';
import type { PlayerLocation } from './enums';

export class InputManager {
  private historyMaxLen = 20000;
  frame = 0;
  inputHistories: InputHistory[] = [];
  constructor(private inputs: Input[]) {}
  frameAdd(location: PlayerLocation, frame: number): void {
    this.frame = frame;
    const input = Input.union(this.inputs);
    if (this.isSameInput(input)) return;
    this.inputHistories.push({ ...input, startFrame: this.frame, location: location });
    if (this.inputHistories.length >= this.historyMaxLen) {
      this.inputHistories.splice(0, this.inputHistories.length - this.historyMaxLen);
    }
  }
  private isSameInput(input: InputResult): boolean {
    const lastInput = this.inputHistories.at(-1);
    if (!lastInput) return false;
    return (
      input.direct === lastInput.direct &&
      lastInput.others.length === input.others.length &&
      lastInput.others.every((v, k) => v === input.others[k])
    );
  }
  clear() {
    this.inputHistories.length = 0;
  }
  setHistoryMaxLen(length: number) {
    this.historyMaxLen = length;
  }
}
