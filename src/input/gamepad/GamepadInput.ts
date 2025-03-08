import { Input } from '../Input';
import type { InputHistory } from '../../types';

export abstract class GamepadInput extends Input {
  private isDestroyed = false;
  protected abstract updateGamepad(): void;
  protected abstract transAxes(axes: readonly number[]): void;
  override getKeys(): Pick<InputHistory, 'direct' | 'others'> {
    !this.isDestroyed && this.updateGamepad();
    return super.getKeys();
  }
  override destroy(): void {
    this.isDestroyed = true;
  }
}
