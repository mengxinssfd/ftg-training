import { Direct } from '../enums';
import type { SOCD } from '../types';

/**
 * SOCD Neutral (SOCDN) - 中立化处理
 * @param directs
 */
export const socdN: SOCD = (directs): void => {
  handleConflicts(directs, [Direct.Right, Direct.Left]);
  handleConflicts(directs, [Direct.Up, Direct.Down]);
};
function handleConflicts(directs: Map<Direct, number>, conflicts: Direct[]): void {
  if (conflicts.every((c) => directs.has(c))) {
    conflicts.forEach((c) => directs.delete(c));
  }
}
