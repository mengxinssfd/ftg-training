import { parserDirectsFromAxes } from '../src/utils';
import { Directs } from '@core';

describe('parserDirectsFromAxes', () => {
  test('axes', () => {
    expect(parserDirectsFromAxes([0, 0])).toEqual([Directs.None]);
    expect(parserDirectsFromAxes([0, -1])).toEqual([Directs.Up]);
    expect(parserDirectsFromAxes([1, -1])).toEqual([Directs.Up, Directs.Right]);
    expect(parserDirectsFromAxes([1, 0])).toEqual([Directs.Right]);
    expect(parserDirectsFromAxes([1, 1])).toEqual([Directs.Right, Directs.Down]);
    expect(parserDirectsFromAxes([0, 1])).toEqual([Directs.Down]);
    expect(parserDirectsFromAxes([-1, 1])).toEqual([Directs.Down, Directs.Left]);
    expect(parserDirectsFromAxes([-1, 0])).toEqual([Directs.Left]);
    expect(parserDirectsFromAxes([-1, -1])).toEqual([Directs.Left, Directs.Up]);
  });
  test('deadZone', () => {
    expect(parserDirectsFromAxes([0, 0])).toEqual([Directs.None]);
    expect(parserDirectsFromAxes([-0.05, 0.05])).toEqual([Directs.Down, Directs.Left]);
    expect(parserDirectsFromAxes([-0.05, 0.05], 0.1)).toEqual([Directs.None]);
  });
});
