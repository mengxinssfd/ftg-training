import type { ImpSkill } from '@/common/skills';
import style from './SkillList.module.scss';

export function SkillList({ skillList }: { skillList: ImpSkill[] }) {
  return (
    <section className={style['_']}>
      搓招表：
      <ul>
        {skillList.map((v, i) => {
          return (
            <li key={i}>
              <span>{v.commandView}</span>
              <span>{v.name}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
