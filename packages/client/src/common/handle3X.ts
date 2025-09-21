import type { InputHandler } from '@core';
import { OtherKeys } from './OtherKeys';

export const handle3X: InputHandler = (_directs, others) => {
  const threeXTime = others.get(OtherKeys['3X']);
  if (!threeXTime) return;
  others.delete(OtherKeys['3X']);
  addToOthers([OtherKeys.LP, OtherKeys.MP, OtherKeys.HP], others, threeXTime);
  addToOthers([OtherKeys.LK, OtherKeys.MK, OtherKeys.HK], others, threeXTime);
};
function addToOthers(add: string[], others: Parameters<InputHandler>[1], threeXTime: number): void {
  if (
    !add.some((v) => {
      const t = others.get(v);
      return t && t >= threeXTime;
    })
  )
    return;
  add.forEach((v) => others.set(v, Date.now()));
}
