import { Direct } from './enums';
import type { InputHistory, SkillDirectsTrigger } from './types';

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
      const anyUp = [Direct.UpLeft, Direct.Up, Direct.UpRight];
      const directs = [Direct.Right, Direct.Left, Direct.Down];
      let hasUp = false;
      for (let i = ih.length - 1; i >= 0; i--) {
        const h = ih[i] as InputHistory;
        if (frame - h.startFrame > skill.limitFrame) return false;
        if (!hasUp) {
          // 先找出任意‘up’
          if (anyUp.includes(h.direct)) hasUp = true;
        } else {
          // 在匹配是否按了另外 3 个方位
          const index = directs.indexOf(h.direct);
          if (index > -1) {
            directs.splice(index, 1);
            if (!directs.length) return true;
          }
        }
      }
      return false;
    },
    720: (ih, skill, frame): boolean => {
      const anyUp = [Direct.UpLeft, Direct.Up, Direct.UpRight];
      const directs = [Direct.Right, Direct.Left, Direct.Down];
      directs.push(...directs);
      let hasUp = false;
      for (let i = ih.length - 1; i >= 0; i--) {
        const h = ih[i] as InputHistory;
        if (frame - h.startFrame > skill.limitFrame) return false;
        // 找出任意‘up’
        if (!hasUp && anyUp.includes(h.direct)) hasUp = true;
        // 匹配是否按了另外 3 个方位
        const index = directs.indexOf(h.direct);
        if (index > -1) {
          directs.splice(index, 1);
          if (!directs.length && hasUp) return true;
        }
      }
      return false;
    },
    66: [Direct.Right, Direct.None, Direct.Right],
    44: [Direct.Left, Direct.None, Direct.Left],
  } satisfies Record<string, Direct[] | SkillDirectsTrigger>;
})();
