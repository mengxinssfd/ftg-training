import { type AttackKey, AttackPower, AttackType, KeyType } from '../types';

export const LightPunch: AttackKey = {
  name: 'LightPunch',
  map: 'u',
  icon: 'lp',
  type: KeyType.Attack,
  power: AttackPower.Light,
  attackType: AttackType.Punch,
};
export const MediumPunch: AttackKey = {
  name: 'MediumPunch',
  map: 'i',
  icon: 'mp',
  type: KeyType.Attack,
  power: AttackPower.Medium,
  attackType: AttackType.Punch,
};
export const HeavyPunch: AttackKey = {
  name: 'HeavyPunch',
  map: 'o',
  icon: 'hp',
  type: KeyType.Attack,
  power: AttackPower.Heavy,
  attackType: AttackType.Punch,
};
export const LightKick: AttackKey = {
  name: 'LightKick',
  map: 'j',
  icon: 'lk',
  type: KeyType.Attack,
  power: AttackPower.Light,
  attackType: AttackType.Kick,
};
export const MediumKick: AttackKey = {
  name: 'MediumKick',
  map: 'k',
  icon: 'mk',
  type: KeyType.Attack,
  power: AttackPower.Medium,
  attackType: AttackType.Kick,
};
export const HeavyKick: AttackKey = {
  name: 'HeavyKick',
  map: 'l',
  icon: 'hk',
  type: KeyType.Attack,
  power: AttackPower.Heavy,
  attackType: AttackType.Kick,
};
