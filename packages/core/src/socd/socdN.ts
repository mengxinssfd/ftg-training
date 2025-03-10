import { Direct } from '../enums';

export function socdN(directs: Set<Direct>): void {
  handleConflicts(directs, [Direct.Right, Direct.Left]);
  handleConflicts(directs, [Direct.Up, Direct.Down]);
}
function handleConflicts(directs: Set<Direct>, conflicts: Direct[]): void {
  if (conflicts.every((c) => directs.has(c))) {
    conflicts.forEach((c) => directs.delete(c));
  }
}
