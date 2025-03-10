import { Directs } from './enums';
import type { InputHistory, SkillDirectsTrigger } from './types';

export const presetDirects = (function () {
  const d236 = [Directs.Down, Directs.DownRight, Directs.Right];
  const d214 = [Directs.Down, Directs.DownLeft, Directs.Left];
  const d323 = [Directs.DownRight, Directs.Down, Directs.DownRight];
  const d63214 = [Directs.Right, Directs.DownRight, ...d214];
  return {
    236: d236,
    236236: [...d236, ...d236],
    26236: [Directs.Down, Directs.Right, ...d236],
    214: d214,
    214214: [...d214, ...d214],
    24214: [Directs.Down, Directs.Left, ...d214],
    2149: [...d214, Directs.UpRight],
    63214: d63214,
    41236: d63214.slice().reverse(),
    22: [Directs.Down, Directs.None, Directs.Down],
    323: d323,
    6323: [Directs.Right, ...d323],
    623: [Directs.Right, Directs.Down, Directs.DownRight],
    63236: [Directs.Right, Directs.DownRight, ...d236],
    6236: [Directs.Right, ...d236],
    636: [Directs.Right, Directs.DownRight, Directs.Right],
    360: (ih, skill, frame): boolean => {
      const anyUp = [Directs.UpLeft, Directs.Up, Directs.UpRight];
      const directs = [Directs.Right, Directs.Left, Directs.Down];
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
      const anyUp = [Directs.UpLeft, Directs.Up, Directs.UpRight];
      const directs = [Directs.Right, Directs.Left, Directs.Down];
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
  } satisfies Record<string, Directs[] | SkillDirectsTrigger>;
})();
