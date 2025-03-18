import { Direct } from '../enums';
import type { SOCD } from '../types';

/**
 * SOCD First Win (SOCDFW) - 首次输入优先(前覆盖)
 * @param directs
 */
export const socdFW: SOCD = (directs): void => {
  handleConflicts(directs, [Direct.Right, Direct.Left]);
  handleConflicts(directs, [Direct.Up, Direct.Down]);
};
function handleConflicts(directs: Map<Direct, Number>, conflicts: [Direct, Direct]): void {
  if (!directs.has(conflicts[0]) || !directs.has(conflicts[1])) return;
  conflicts.sort((a, b) => ((directs.get(a) ?? 0) as number) - ((directs.get(b) ?? 0) as number));
  directs.delete(conflicts[1]);
}
