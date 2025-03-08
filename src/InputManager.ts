import type { Input } from './input';
import type { InputHistory } from './types';
import type { PlayerLocation } from './enums';

export class InputManager {
  private historyLen = 20000;
  frame = 0;
  inputHistory: InputHistory[] = [];

  constructor(private input: Input) {}
  frameAdd(location: PlayerLocation, frame: number): void {
    this.frame = frame;
    const input = this.input.getKeys();
    if (this.isSameCommand(input)) return;
    this.inputHistory.push({ ...input, startFrame: this.frame, location: location });
    if (this.inputHistory.length >= this.historyLen) {
      this.inputHistory.splice(0, this.inputHistory.length - this.historyLen);
    }
  }
  private isSameCommand(input: Pick<InputHistory, 'direct' | 'others'>): boolean {
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
