import { Direct, socdN } from '../src';

describe('socdN', () => {
  test('up down', () => {
    const set = new Set<Direct>([Direct.Down, Direct.Up]);
    expect(set.size).toBe(2);
    socdN(set);
    expect(set.size).toBe(0);
  });
  test('left right', () => {
    const set = new Set<Direct>([Direct.Left, Direct.Right]);
    expect(set.size).toBe(2);
    socdN(set);
    expect(set.size).toBe(0);
  });
  test('all', () => {
    const set = new Set<Direct>([Direct.Down, Direct.Up, Direct.Left, Direct.Right]);
    expect(set.size).toBe(4);
    socdN(set);
    expect(set.size).toBe(0);
  });
});
