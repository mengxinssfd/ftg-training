import { Direct, transDirect4To8 } from '@core';

export class DirectCollector extends Map<Direct, number> {
  /**
   * 根据方向列表更新，如果方向列表没有的会被删除
   * @param directs
   */
  updateWithDirects(directs: Direct[]): void {
    const lastDirects = new Map(this);
    this.clear();
    directs.forEach((d) => this.set(d, lastDirects.get(d) ?? Date.now()));
  }
  /**
   * 联合，如果两个都存在同样的key，那么旧的优先
   * @param other
   */
  innerUnion(other: DirectCollector): void {
    other.forEach((ot, direct) => {
      const nt = this.get(direct);
      if (nt !== undefined && ot >= nt) return;
      this.set(direct, ot);
    });
  }
  /**
   * 联合，如果两个都存在同样的key，那么旧的优先
   * @param other
   */
  union(other: DirectCollector): DirectCollector {
    const newStore = new DirectCollector(this);
    newStore.innerUnion(other);
    return newStore;
  }
  toDirect(): Direct {
    return transDirect4To8(new Set(this.keys()));
  }
  static isDirect(key: unknown): key is Direct {
    const directs = [Direct.Up, Direct.Down, Direct.Left, Direct.Right];
    return directs.includes(key as Direct);
  }
}
