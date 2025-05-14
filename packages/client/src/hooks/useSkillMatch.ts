import { useEffect, useState } from 'react';
import type { ImpSkill } from '@/common/skills';
import { Player } from '@core';
import { runFPS } from '@tool-pack/dom';

const odReplaceFrame = 5; // od技和普通技能在 odTime 帧数内则替换为 od 技
const nextSkillFrame = 50; // 50 帧内不得再次匹配技能

export function useSkillMatch({
  player,
}: {
  player: Player;
}): [skill: ImpSkill | undefined, frame: number] {
  const [frame, setFrame] = useState<number>(0);
  const [skill, setSkill] = useState<ImpSkill>();
  useEffect(() => {
    const lastMatched: { frame: number; skill: ImpSkill | null } = { frame: -50, skill: null };
    const abort = new AbortController();
    runFPS({
      abortSignal: abort.signal,
      callback(): void {
        player.frameAdd();
        setFrame(player.frame);
        const frameDiff = player.frame - lastMatched.frame;
        // 如果距离上次搓招成功大于 100 帧，则撤销显示技能
        if (frameDiff > 100) setSkill(undefined);
        const skill = player.matchSkill<ImpSkill>();
        if (skill) {
          // 如果距离上一次搓招成功小于 50 帧则不可再次搓招判定,除了 OD技
          if (frameDiff < nextSkillFrame) {
            if (
              frameDiff < odReplaceFrame &&
              skill.extends &&
              skill.extends === lastMatched.skill
            ) {
              _setSkill(skill);
            }
            return;
          }
          _setSkill(skill);
        }
        function _setSkill(skill: ImpSkill): void {
          setSkill((lastMatched.skill = skill));
          lastMatched.frame = player.frame;
        }
      },
    });
    return () => {
      abort.abort();
    };
  }, []);

  return [skill, frame];
}
