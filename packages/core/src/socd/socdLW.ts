import { Direct } from '../enums';
import type { SOCD } from '../types';

/**
 * SOCD Last Win (SOCDLW) - 最后输入优先(后覆盖)
 * @param directs
 */
export const socdLW: SOCD = (directs): void => {
  handleConflicts(directs, [Direct.Right, Direct.Left]);
  handleConflicts(directs, [Direct.Up, Direct.Down]);
};
function handleConflicts(directs: Map<Direct, Number>, conflicts: [Direct, Direct]): void {
  if (!directs.has(conflicts[0]) || !directs.has(conflicts[1])) return;
  conflicts.sort((a, b) => ((directs.get(b) ?? 0) as number) - ((directs.get(a) ?? 0) as number));
  directs.delete(conflicts[1]);
}
