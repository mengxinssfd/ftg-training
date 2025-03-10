import { iconMap } from './iconMap';
import { presetDirects } from '@core';
import type { Skill, InputHistory } from '@core';
import { OtherKeys } from './OtherKeys';

export interface ImpSkill extends Skill {
  commandView: string;
}

const punches = [OtherKeys.LP, OtherKeys.MP, OtherKeys.HP];
const punches2 = [
  [OtherKeys.LP, OtherKeys.MP],
  [OtherKeys.LP, OtherKeys.HP],
  [OtherKeys.MP, OtherKeys.HP],
];
const anyPunch = (i: InputHistory): boolean => punches.some((k) => i.others.includes(k));
const anyPunch2 = (i: InputHistory): boolean =>
  punches2.some((ks) => ks.every((k) => i.others.includes(k)));
const kicks = [OtherKeys.LK, OtherKeys.MK, OtherKeys.HK];
const kicks2 = [
  [OtherKeys.LK, OtherKeys.MK],
  [OtherKeys.LK, OtherKeys.HK],
  [OtherKeys.MK, OtherKeys.HK],
];
const anyKick = (i: InputHistory): boolean => kicks.some((k) => i.others.includes(k));
const anyKick2 = (i: InputHistory): boolean =>
  kicks2.some((ks) => ks.every((k) => i.others.includes(k)));

function createODSkill(skill: ImpSkill): ImpSkill {
  return {
    ...skill,
    matchPriority: skill.matchPriority + 1,
    name: 'OD' + skill.name,
    commandView:
      skill.directs[0].map((d) => iconMap[d]).join('') +
      '+' +
      (skill.trigger === anyPunch ? 'pp' : 'kk'),
    trigger: skill.trigger === anyPunch ? anyPunch2 : anyKick2,
  };
}

export const D236: ImpSkill = {
  limitFrame: 20,
  matchPriority: 0,
  name: '波动拳',
  commandView: `${presetDirects['236'].map((d) => iconMap[d]).join('')} + p`,
  directs: [presetDirects['236']],
  trigger: anyPunch,
};

export const OD236 = createODSkill(D236);

export const D214: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '旋风腿',
  commandView: `${presetDirects['214'].map((d) => iconMap[d]).join('')} + k`,
  directs: [presetDirects['214']],
  trigger: anyKick,
};
export const OD214 = createODSkill(D214);

export const D22: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '天升脚',
  commandView: `${presetDirects['22'].map((d) => iconMap[d]).join('')} + k`,
  directs: [presetDirects['22']],
  trigger: anyKick,
};
export const OD22 = createODSkill(D22);

export const D623: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '升龙拳',
  commandView: `${presetDirects['623'].map((d) => iconMap[d]).join('')} + p`,
  directs: [
    presetDirects['623'],
    presetDirects['323'],
    presetDirects['6236'],
    presetDirects['636'],
  ],
  trigger: anyPunch,
};
export const OD623 = createODSkill(D623);

export const D2149: ImpSkill = {
  matchPriority: 1,
  limitFrame: 25,
  name: '空箭',
  commandView: `${presetDirects['2149'].map((d) => iconMap[d]).join('')} + k`,
  directs: [presetDirects['2149']],
  trigger: anyKick,
};
export const OD2149 = createODSkill(D2149);

export const Sa1: ImpSkill = {
  matchPriority: 2,
  limitFrame: 30,
  name: '真空波动拳',
  commandView: `${presetDirects['236236'].map((d) => iconMap[d]).join('')} + k`,
  directs: [presetDirects['236236']],
  trigger: anyKick,
};
export const Sa2: ImpSkill = {
  matchPriority: 2,
  limitFrame: 30,
  name: '真升龙拳',
  commandView: `${presetDirects['214214'].map((d) => iconMap[d]).join('')} + p`,
  directs: [presetDirects['214214']],
  trigger: anyPunch,
};
export const Sa3: ImpSkill = {
  matchPriority: 2,
  limitFrame: 30,
  name: '神龙裂破',
  commandView: `${presetDirects['236236'].map((d) => iconMap[d]).join('')} + p`,
  directs: [presetDirects['236236']],
  trigger: anyPunch,
};

export const D180: ImpSkill = {
  matchPriority: 1,
  limitFrame: 35,
  name: '180',
  commandView: `180 + p`,
  directs: [presetDirects['63214'], presetDirects['41236']],
  trigger: anyPunch,
};

export const D360: ImpSkill = {
  matchPriority: 2,
  limitFrame: 50,
  name: '360',
  commandView: `360 + p`,
  directs: presetDirects['360'],
  trigger: anyPunch,
};

export const D720: ImpSkill = {
  matchPriority: 2,
  limitFrame: 50,
  name: '720',
  commandView: `720 + p`,
  directs: presetDirects['720'],
  trigger: anyPunch,
};
