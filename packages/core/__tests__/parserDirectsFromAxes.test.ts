import { parserDirectsFromAxes } from '../src/utils';
import { Direct } from '@core';

describe('parserDirectsFromAxes', () => {
  test('axes', () => {
    expect(parserDirectsFromAxes([0, 0])).toEqual([Direct.None]);
    expect(parserDirectsFromAxes([0, -1])).toEqual([Direct.Up]);
    expect(parserDirectsFromAxes([1, -1])).toEqual([Direct.Up, Direct.Right]);
    expect(parserDirectsFromAxes([1, 0])).toEqual([Direct.Right]);
    expect(parserDirectsFromAxes([1, 1])).toEqual([Direct.Right, Direct.Down]);
    expect(parserDirectsFromAxes([0, 1])).toEqual([Direct.Down]);
    expect(parserDirectsFromAxes([-1, 1])).toEqual([Direct.Down, Direct.Left]);
    expect(parserDirectsFromAxes([-1, 0])).toEqual([Direct.Left]);
    expect(parserDirectsFromAxes([-1, -1])).toEqual([Direct.Left, Direct.Up]);
  });
  test('deadZone', () => {
    expect(parserDirectsFromAxes([0, 0])).toEqual([Direct.None]);
    expect(parserDirectsFromAxes([-0.05, 0.05])).toEqual([Direct.Down, Direct.Left]);
    expect(parserDirectsFromAxes([-0.05, 0.05], 0.1)).toEqual([Direct.None]);
  });
});
