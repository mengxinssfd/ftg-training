import { parseDirectsFromAxes } from '../src/utils';
import { Direct } from '@core';

describe('parseDirectsFromAxes', () => {
  test('axes', () => {
    expect(parseDirectsFromAxes([0, 0])).toEqual([Direct.None]);
    expect(parseDirectsFromAxes([0, -1])).toEqual([Direct.Up]);
    expect(parseDirectsFromAxes([1, -1])).toEqual([Direct.Up, Direct.Right]);
    expect(parseDirectsFromAxes([1, 0])).toEqual([Direct.Right]);
    expect(parseDirectsFromAxes([1, 1])).toEqual([Direct.Right, Direct.Down]);
    expect(parseDirectsFromAxes([0, 1])).toEqual([Direct.Down]);
    expect(parseDirectsFromAxes([-1, 1])).toEqual([Direct.Down, Direct.Left]);
    expect(parseDirectsFromAxes([-1, 0])).toEqual([Direct.Left]);
    expect(parseDirectsFromAxes([-1, -1])).toEqual([Direct.Left, Direct.Up]);
  });
  test('deadZone', () => {
    expect(parseDirectsFromAxes([0, 0])).toEqual([Direct.None]);
    expect(parseDirectsFromAxes([-0.05, 0.05])).toEqual([Direct.Down, Direct.Left]);
    expect(parseDirectsFromAxes([-0.05, 0.05], 0.1)).toEqual([Direct.None]);
  });
});
