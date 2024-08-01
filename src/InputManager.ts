import { type AttackKey, type Key, KeyType } from './types';
import { None } from './keys';

export class InputManager {
  private keymap = new Map<string, Key>();
  downKeyMap = new Set<Key>();
  downKeys: { direct: Key; attacks: AttackKey[] } = { direct: None, attacks: [] };
  inputHistory: { key: Key; type: 'down' | 'up' }[] = [];
  keyRecorder: {
    attacks: AttackKey[];
    direct: Key;
    startTime: number;
    endTime: number;
    ms: number;
  }[] = [];

  input(key: string, type: 'down' | 'up'): void {
    const { keymap, downKeyMap, downKeys } = this;
    const k = keymap.get(key);
    if (k) {
      let key = k.match ? k.match(this) : k;
      this.inputHistory.length = 99;
      this.inputHistory.unshift({ key, type });
      if (type === 'down') {
        // 按键按下时，斜方向跟正方向不对等
        if (k !== key) downKeyMap.delete(k);
        downKeyMap.add(k);
      } else {
        downKeyMap.delete(k);
        if (key.type === KeyType.Direct && k !== key && downKeys.direct !== None) {
          type = 'down';
          key = downKeys.direct?.match?.(this) || key;
          downKeyMap.add(key);
        }
      }
      this.record(key, type);
    }
  }

  private record(key: Key, type: 'down' | 'up') {
    const { keyRecorder, downKeys } = this;
    const now = Date.now();
    if (type === 'down') {
      if (isAttackKey(key)) {
        if (!downKeys.attacks.includes(key)) downKeys.attacks.push(key);
      } else {
        downKeys.direct = key;
      }
      const prev = keyRecorder[0];
      const next = {
        direct: downKeys.direct,
        attacks: downKeys.attacks.slice(),
        startTime: now,
        endTime: -1,
        ms: 0,
      };
      if (prev) {
        prev.endTime = now;
      }
      keyRecorder.unshift(next);
    } else {
      if (isAttackKey(key)) {
        const index = downKeys.attacks.indexOf(key);
        if (index >= 0) {
          downKeys.attacks.splice(index);
        }
      } else {
        downKeys.direct = None;
      }
      const first = keyRecorder[0];
      if (first) {
        first.endTime = now;
        first.ms = now - first.startTime;
      }
    }
  }

  clear() {
    this.inputHistory.length = 0;
    this.keyRecorder.length = 0;
  }

  registerKeys(keys: Key[]): void {
    keys.forEach((key: Key) => {
      this.keymap.set(key.map, key);
    });
  }
}

function isAttackKey(key: Key): key is AttackKey {
  return key.type === KeyType.Attack;
}
