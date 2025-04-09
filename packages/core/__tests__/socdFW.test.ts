import { Direct, DirectCollector, socdFW } from '../src';

describe('socdFW', () => {
  test('up down', () => {
    const map = new DirectCollector([
      [Direct.Down, 0],
      [Direct.Up, 1],
    ]);
    expect(map.size).toBe(2);
    socdFW(map);
    expect(map.size).toBe(1);
    expect(map.has(Direct.Down)).toBe(true);
  });
  test('left right', () => {
    const map = new DirectCollector([
      [Direct.Left, 0],
      [Direct.Right, 1],
    ]);
    expect(map.size).toBe(2);
    socdFW(map);
    expect(map.size).toBe(1);
    expect(map.has(Direct.Left)).toBe(true);
  });
  test('all', () => {
    const map = new DirectCollector([
      [Direct.Down, 0],
      [Direct.Up, 1],
      [Direct.Left, 2],
      [Direct.Right, 3],
    ]);
    expect(map.size).toBe(4);
    socdFW(map);
    expect(map.size).toBe(2);
    expect(map.has(Direct.Down)).toBe(true);
    expect(map.has(Direct.Left)).toBe(true);
  });
});
