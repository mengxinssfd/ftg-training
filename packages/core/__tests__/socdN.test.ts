import { Direct, DirectCollector, socdN } from '../src';

describe('socdN', () => {
  test('up down', () => {
    const set = new DirectCollector([
      [Direct.Down, 0],
      [Direct.Up, 1],
    ]);
    expect(set.size).toBe(2);
    socdN(set);
    expect(set.size).toBe(0);
  });
  test('left right', () => {
    const set = new DirectCollector([
      [Direct.Left, 0],
      [Direct.Right, 1],
    ]);
    expect(set.size).toBe(2);
    socdN(set);
    expect(set.size).toBe(0);
  });
  test('all', () => {
    const set = new DirectCollector([
      [Direct.Down, 0],
      [Direct.Up, 1],
      [Direct.Left, 2],
      [Direct.Right, 3],
    ]);
    expect(set.size).toBe(4);
    socdN(set);
    expect(set.size).toBe(0);
  });
});
