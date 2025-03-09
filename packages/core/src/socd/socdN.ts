import { Directs } from '../enums';

export function socdN(directs: Set<Directs>): void {
  handleConflicts(directs, [Directs.Right, Directs.Left]);
  handleConflicts(directs, [Directs.Up, Directs.Down]);
}
function handleConflicts(directs: Set<Directs>, conflicts: Directs[]): void {
  if (conflicts.every((c) => directs.has(c))) {
    conflicts.forEach((c) => directs.delete(c));
  }
}
