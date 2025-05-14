import { Direct } from './enums';
import type { InputHistory, SkillDirectsTrigger } from './types';
import { findIndexOfInputHistories, transDirectByLocation } from './utils';

/**
 * 预设的方向指令集合
 *
 * @description
 * 提供格斗游戏中常用的方向输入组合，包括：
 * - 基础指令：如前冲（66）、后退（44）等
 * - 必杀技指令：如波动拳（236）、升龙拳（623）等
 * - 蓄力指令：如后前（46）、下上（28）等
 * - 特殊指令：如 360 度、720 度等旋转指令
 *
 * 方向代号说明：
 * - 7: 左上  8: 上   9: 右上
 * - 4: 左    5: 中立  6: 右
 * - 1: 左下  2: 下   3: 右下
 *
 * @example
 * // 波动拳指令 (236)
 * presetDirects['236'] // [Down, DownRight, Right]
 *
 * // 升龙拳指令 (623)
 * presetDirects['623'] // [Right, Down, DownRight]
 */
export const presetDirects = (function () {
  const defChargeFrame = 45;
  const anyUp = [Direct.UpLeft, Direct.Up, Direct.UpRight];
  // 常用基础方向组合
  const d236 = [Direct.Down, Direct.DownRight, Direct.Right];
  const d214 = [Direct.Down, Direct.DownLeft, Direct.Left];
  const d323 = [Direct.DownRight, Direct.Down, Direct.DownRight];
  const d63214 = [Direct.Right, Direct.DownRight, ...d214];
  return {
    // 基础必杀技指令
    236: d236, // 波动拳
    236236: [...d236, ...d236], // 标准超杀
    26236: [Direct.Down, Direct.Right, ...d236], // 优化超杀
    214: d214, // 反波动拳
    214214: [...d214, ...d214], // 反向超杀
    24214: [Direct.Down, Direct.Left, ...d214], // 改良反向超杀
    2149: [...d214, Direct.UpRight], // 先摇空箭
    63214: d63214, // 指令头
    41236: d63214.slice().reverse(), // 反向指令投

    // 特殊动作指令
    22: [Direct.Down, Direct.None, Direct.Down], // 下下
    323: d323, // 蹲升龙
    6323: [Direct.Right, ...d323], // 摇杆标准升龙
    623: [Direct.Right, Direct.Down, Direct.DownRight], // 标准升龙
    63236: [Direct.Right, Direct.DownRight, ...d236], // 摇杆626升龙
    6236: [Direct.Right, ...d236], // 键盘626升龙
    636: [Direct.Right, Direct.DownRight, Direct.Right], // 636升龙

    // 360度转圈指令判定
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
        return false;
      });
      return index > -1;
    },

    // 720度双转圈指令判定
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

    // 基本移动指令
    66: [Direct.Right, Direct.None, Direct.Right], // 前冲
    44: [Direct.Left, Direct.None, Direct.Left], // 后退

    // 后前蓄力指令判定
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

    // 下上蓄力指令判定
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
