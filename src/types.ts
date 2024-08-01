import type { InputManager } from './InputManager';

export enum KeyType {
  Direct,
  Attack,
}

export enum AttackPower {
  Light,
  Medium,
  Heavy,
}
export enum AttackType {
  Punch,
  Kick,
}

export interface Key {
  map: string;
  icon: string;
  name: string;
  type: KeyType;
  match?: (history: InputManager) => Key;
}

export interface DirectKey extends Key {
  type: KeyType.Direct;
}
export interface AttackKey extends Key {
  type: KeyType.Attack;
  power: AttackPower;
  attackType: AttackType;
}
