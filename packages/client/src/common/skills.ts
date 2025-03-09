import { iconMap } from './iconMap';
import { commands } from '@core';
import type { Skill } from '@core';
import { OtherKeys } from './OtherKeys';

export interface ImpSkill extends Skill {
  commandView: string;
}

export const Hadouken: ImpSkill = {
  limitFrame: 20,
  matchPriority: 0,
  name: '波动拳',
  commandView: `${commands['236'].map((d) => iconMap[d]).join('')} + p`,
  directs: [commands['236']],
  trigger: OtherKeys.LP,
};

export const Shoryuken: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '升龙拳',
  commandView: `${commands['623'].map((d) => iconMap[d]).join('')} + p`,
  directs: [commands['623'], commands['323'], commands['6236'], commands['636']],
  trigger: (i) => {
    const keys = [OtherKeys.LP, OtherKeys.MP, OtherKeys.HP];
    return keys.some((k) => i.others.includes(k));
  },
};
export const AirArrow: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '空箭',
  commandView: `${commands['2149'].map((d) => iconMap[d]).join('')} + k`,
  directs: [commands['2149']],
  trigger: (i) => {
    const keys = [OtherKeys.LK, OtherKeys.MK, OtherKeys.HK];
    return keys.some((k) => i.others.includes(k));
  },
};
export const OdShoryuken: ImpSkill = {
  matchPriority: 3,
  limitFrame: 20,
  name: 'OD升龙拳',
  commandView: `${commands['623'].map((d) => iconMap[d]).join('')} + pp`,
  directs: [commands['623'], commands['323'], commands['6236']],
  trigger: (i) => {
    const keys = [
      [OtherKeys.LP, OtherKeys.MP],
      [OtherKeys.LP, OtherKeys.HP],
      [OtherKeys.MP, OtherKeys.HP],
    ];
    return keys.some((ks) => ks.every((k) => i.others.includes(k)));
  },
};
export const Sa3: ImpSkill = {
  matchPriority: 2,
  limitFrame: 30,
  name: '神龙裂破',
  commandView: `${commands['236236'].map((d) => iconMap[d]).join('')} + p`,
  directs: [commands['236236']],
  trigger: (i) => {
    const keys = [OtherKeys.LP, OtherKeys.MP, OtherKeys.HP];
    return keys.some((k) => i.others.includes(k));
  },
};
export const D180: ImpSkill = {
  matchPriority: 1,
  limitFrame: 35,
  name: '180',
  commandView: `180 + p`,
  directs: [commands['63214'], commands['41236']],
  trigger: (i) => {
    const keys = [OtherKeys.LP, OtherKeys.MP, OtherKeys.HP];
    return keys.some((k) => i.others.includes(k));
  },
};
export const D214: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '旋风腿',
  commandView: `${commands['214'].map((d) => iconMap[d]).join('')} + k`,
  directs: [commands['214']],
  trigger: (i) => {
    const keys = [OtherKeys.LK, OtherKeys.MK, OtherKeys.HK];
    return keys.some((k) => i.others.includes(k));
  },
};
export const D360: ImpSkill = {
  matchPriority: 2,
  limitFrame: 50,
  name: '360',
  commandView: `360 + p`,
  directs: commands['360'],
  trigger: (i) => {
    const keys = [OtherKeys.LP, OtherKeys.MP, OtherKeys.HP];
    return keys.some((k) => i.others.includes(k));
  },
};
export const D22: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '天升脚',
  commandView: `${commands['22'].map((d) => iconMap[d]).join('')} + k`,
  directs: [commands['22']],
  trigger: (i) => {
    const keys = [OtherKeys.LK, OtherKeys.MK, OtherKeys.HK];
    return keys.some((k) => i.others.includes(k));
  },
};
export const D720: ImpSkill = {
  matchPriority: 2,
  limitFrame: 50,
  name: '720',
  commandView: `720 + p`,
  directs: commands['720'],
  trigger: (i) => {
    const keys = [OtherKeys.LP, OtherKeys.MP, OtherKeys.HP];
    return keys.some((k) => i.others.includes(k));
  },
};
