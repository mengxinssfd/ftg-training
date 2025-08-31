import type { InputHandler } from '@core';
import { OtherKeys } from './OtherKeys';

export const handle3X: InputHandler = (_directs, others) => {
  if (!others.has(OtherKeys['3X'])) return;
  others.delete(OtherKeys['3X']);
  addToOthers([OtherKeys.LP, OtherKeys.MP, OtherKeys.HP], others);
  addToOthers([OtherKeys.LK, OtherKeys.MK, OtherKeys.HK], others);
};
function addToOthers(add: string[], others: Parameters<InputHandler>[1]): void {
  if (!add.some((v) => others.has(v))) return;
  add.forEach((v) => others.add(v));
}
