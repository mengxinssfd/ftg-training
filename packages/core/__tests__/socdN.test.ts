import { Directs, socdN } from '../src';

describe('socdN', () => {
  test('up down', () => {
    const set = new Set<Directs>([Directs.Down, Directs.Up]);
    expect(set.size).toBe(2);
    socdN(set);
    expect(set.size).toBe(0);
  });
  test('left right', () => {
    const set = new Set<Directs>([Directs.Left, Directs.Right]);
    expect(set.size).toBe(2);
    socdN(set);
    expect(set.size).toBe(0);
  });
  test('all', () => {
    const set = new Set<Directs>([Directs.Down, Directs.Up, Directs.Left, Directs.Right]);
    expect(set.size).toBe(4);
    socdN(set);
    expect(set.size).toBe(0);
  });
});
