import { Direct, socdLW } from '../src';

describe('socdLW', () => {
  test('up down', () => {
    const map = new Map<Direct, number>([
      [Direct.Down, 0],
      [Direct.Up, 1],
    ]);
    expect(map.size).toBe(2);
    socdLW(map);
    expect(map.size).toBe(1);
    expect(map.has(Direct.Up)).toBe(true);
  });
  test('left right', () => {
    const map = new Map<Direct, number>([
      [Direct.Left, 0],
      [Direct.Right, 1],
    ]);
    expect(map.size).toBe(2);
    socdLW(map);
    expect(map.size).toBe(1);
    expect(map.has(Direct.Right)).toBe(true);
  });
  test('all', () => {
    const map = new Map<Direct, number>([
      [Direct.Down, 0],
      [Direct.Up, 1],
      [Direct.Left, 2],
      [Direct.Right, 3],
    ]);
    expect(map.size).toBe(4);
    socdLW(map);
    expect(map.size).toBe(2);
    expect(map.has(Direct.Up)).toBe(true);
    expect(map.has(Direct.Right)).toBe(true);
  });
});
