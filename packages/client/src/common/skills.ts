import { iconMap } from './iconMap';
import { Direct, findIndexOfInputHistories, matchCommand, presetDirects } from '@core';
import type { Skill, InputHistory } from '@core';
import { OtherKeys } from './OtherKeys';

export enum SkillType {
  Common,
  OD,
  SA,
}

export interface ImpSkill extends Skill {
  commandView: string;
  extends?: ImpSkill;
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
  // 不会传函数的过来
  const directs = skill.directs as Direct[][];
  return {
    ...skill,
    extends: skill,
    matchPriority: skill.matchPriority + 1,
    name: 'OD' + skill.name,
    commandView:
      directs[0]!.map((d) => iconMap[d]).join('') +
      ' + ' +
      (skill.trigger === anyPunch ? 'pp' : 'kk'),
    trigger: skill.trigger === anyPunch ? anyPunch2 : anyKick2,
  };
}

export const P236: ImpSkill = {
  limitFrame: 20,
  matchPriority: 0,
  name: '波动拳',
  commandView: `${presetDirects['236'].map((d) => iconMap[d]).join('')} + p`,
  directs: [presetDirects['236']],
  trigger: anyPunch,
};

export const P236OD = createODSkill(P236);

export const K214: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '龙卷旋风腿',
  commandView: `${presetDirects['214'].map((d) => iconMap[d]).join('')} + k`,
  directs: [presetDirects['214']],
  trigger: anyKick,
};
export const K214OD = createODSkill(K214);
export const P214: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '波掌击',
  commandView: `${presetDirects['214'].map((d) => iconMap[d]).join('')} + k`,
  directs: [presetDirects['214']],
  trigger: anyPunch,
};
export const P214OD = createODSkill(P214);
export const K236: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '上段足刀踢',
  commandView: `${presetDirects['236'].map((d) => iconMap[d]).join('')} + k`,
  directs: [presetDirects['236']],
  trigger: anyKick,
};
export const k236OD = createODSkill(K236);

export const K22: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '电刃炼气',
  commandView: `${presetDirects['22'].map((d) => iconMap[d]).join('')} + p`,
  directs: [presetDirects['22']],
  trigger: anyPunch,
};
// export const K22OD = createODSkill(K22);

export const P623: ImpSkill = {
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
export const P623OD = createODSkill(P623);

export const K2149: ImpSkill = {
  matchPriority: 2,
  limitFrame: 25,
  name: '空箭',
  commandView: `${presetDirects['2149'].map((d) => iconMap[d]).join('')} + k`,
  directs: [presetDirects['2149']],
  trigger: anyKick,
};
export const K2149OD = createODSkill(K2149);

export const Sa1: ImpSkill = {
  matchPriority: 2,
  limitFrame: 30,
  name: '真空波动拳',
  commandView: `${presetDirects['236236'].map((d) => iconMap[d]).join('')} + p`,
  directs: [presetDirects['236236']],
  trigger: anyPunch,
};
export const Sa2: ImpSkill = {
  matchPriority: 2,
  limitFrame: 30,
  name: '真·波掌击',
  commandView: `${presetDirects['214214'].map((d) => iconMap[d]).join('')} + p`,
  directs: [presetDirects['214214']],
  trigger: anyPunch,
};
export const Sa3: ImpSkill = {
  matchPriority: 2,
  limitFrame: 30,
  name: '真·升龙拳',
  commandView: `${presetDirects['236236'].map((d) => iconMap[d]).join('')} + k`,
  directs: [presetDirects['236236']],
  trigger: anyKick,
};

export const P180: ImpSkill = {
  matchPriority: 1,
  limitFrame: 35,
  name: '180指令投',
  commandView: `180 + p`,
  directs: [presetDirects['63214'], presetDirects['41236']],
  trigger: anyPunch,
};

export const D360: ImpSkill = {
  matchPriority: 2,
  limitFrame: 50,
  name: '360指令投',
  commandView: `360 + p`,
  directs: presetDirects['360'],
  trigger: anyPunch,
};

export const D720: ImpSkill = {
  matchPriority: 3,
  limitFrame: 50,
  name: '720指令投',
  commandView: `720 + p`,
  directs: presetDirects['720'],
  trigger: anyPunch,
};

const driveParryKeys = [OtherKeys.MK, OtherKeys.MP];
const lOrR = [Direct.Left, Direct.Right];
export const DriveRush: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '斗气疾跑',
  commandView: `mk,mp + ${presetDirects['66'].map((d) => iconMap[d]).join('')}`,
  directs: (ih, skill, frame) => {
    const match = matchCommand(presetDirects['66'], ih, skill.limitFrame, frame);
    if (!match) return false;
    const i = findIndexOfInputHistories(ih, skill.limitFrame, frame, (h) => {
      return driveParryKeys.every((k) => h.others.includes(k));
    });
    return i > -1;
  },
  trigger: (ih) => {
    // 两种情况：一种是先蓝防后 66，一种是先 66 后蓝防
    return lOrR.includes(ih.direct) || driveParryKeys.every((k) => ih.others.includes(k));
  },
};

export const P46: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '头槌',
  commandView: `${iconMap[Direct.Left]}(蓄力)${iconMap[Direct.Right]} + p`,
  directs: presetDirects['46'],
  trigger: anyPunch,
};
export const OD46: ImpSkill = {
  ...P46,
  matchPriority: 2,
  name: 'OD' + P46.name,
  commandView: P46.commandView + 'p',
  trigger: anyPunch2,
};
export const P28: ImpSkill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '大屁股',
  commandView: `${iconMap[Direct.Down]}(蓄力)${iconMap[Direct.Up]} + p`,
  directs: presetDirects['28'],
  trigger: anyPunch,
};
export const OD28: ImpSkill = {
  ...P28,
  matchPriority: 2,
  name: 'OD' + P28.name,
  commandView: P28.commandView + 'p',
  trigger: anyPunch2,
};
