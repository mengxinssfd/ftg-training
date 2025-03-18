import { Direct } from './enums';
import type { InputHistory, SkillDirectsTrigger } from './types';
import { findIndexOfInputHistories, transDirectByLocation } from './utils';

const defChargeFrame = 45;
const anyUp = [Direct.UpLeft, Direct.Up, Direct.UpRight];
export const presetDirects = (function () {
  const d236 = [Direct.Down, Direct.DownRight, Direct.Right];
  const d214 = [Direct.Down, Direct.DownLeft, Direct.Left];
  const d323 = [Direct.DownRight, Direct.Down, Direct.DownRight];
  const d63214 = [Direct.Right, Direct.DownRight, ...d214];
  return {
    236: d236,
    236236: [...d236, ...d236],
    26236: [Direct.Down, Direct.Right, ...d236],
    214: d214,
    214214: [...d214, ...d214],
    24214: [Direct.Down, Direct.Left, ...d214],
    2149: [...d214, Direct.UpRight],
    63214: d63214,
    41236: d63214.slice().reverse(),
    22: [Direct.Down, Direct.None, Direct.Down],
    323: d323,
    6323: [Direct.Right, ...d323],
    623: [Direct.Right, Direct.Down, Direct.DownRight],
    63236: [Direct.Right, Direct.DownRight, ...d236],
    6236: [Direct.Right, ...d236],
    636: [Direct.Right, Direct.DownRight, Direct.Right],
    360: (ih, skill, frame): boolean => {
      const directs = [Direct.Right, Direct.Left, Direct.Down];
      let hasUp = false;
      const index = findIndexOfInputHistories(ih, skill.limitFrame, frame, (h): boolean => {
        if (!hasUp) {
          // 先找出任意‘up’
          if (anyUp.includes(h.direct)) hasUp = true;
          return false;
        }
        // 在匹配是否按了另外 3 个方位
        const index = directs.indexOf(h.direct);
        if (index > -1) {
          directs.splice(index, 1);
          if (!directs.length) return true;
        }
      });
      return index > -1;
    },
    720: (ih, skill, frame): boolean => {
      const directs = [Direct.Right, Direct.Left, Direct.Down];
      directs.push(...directs);
      let hasUp = false;
      const i = findIndexOfInputHistories(ih, skill.limitFrame, frame, (h): boolean => {
        // 找出任意‘up’
        if (!hasUp && anyUp.includes(h.direct)) hasUp = true;
        // 匹配是否按了另外 3 个方位
        const index = directs.indexOf(h.direct);
        if (index > -1) {
          directs.splice(index, 1);
          if (!directs.length && hasUp) return true;
        }
        return false;
      });
      return i > -1;
    },
    66: [Direct.Right, Direct.None, Direct.Right],
    44: [Direct.Left, Direct.None, Direct.Left],
    46: (ih, skill, frame): boolean => {
      const anyLeft = [Direct.Left, Direct.DownLeft];
      let rightIH: InputHistory;
      const chargeFrame = skill.chargeFrame ?? defChargeFrame;
      const index = findIndexOfInputHistories(ih, skill.limitFrame, frame, (h): boolean => {
        const direct = transDirectByLocation(h.location, h.direct);
        if (!rightIH) {
          if (Direct.Right === direct) rightIH = h;
          return false;
        }
        if (anyLeft.includes(direct)) {
          if (rightIH.startFrame - h.startFrame >= chargeFrame) return true;
        }
        return false;
      });
      return index > -1;
    },
    28: (ih, skill, frame): boolean => {
      const anyDown = [Direct.Down, Direct.DownLeft, Direct.DownRight];
      let upIH: InputHistory;
      const chargeFrame = skill.chargeFrame ?? defChargeFrame;
      const index = findIndexOfInputHistories(ih, skill.limitFrame, frame, (h): boolean => {
        if (!upIH) {
          if (anyUp.includes(h.direct)) upIH = h;
          return false;
        }
        if (anyDown.includes(h.direct)) {
          if (upIH.startFrame - h.startFrame >= chargeFrame) return true;
        }
        return false;
      });
      return index > -1;
    },
  } satisfies Record<string, Direct[] | SkillDirectsTrigger>;
})();
