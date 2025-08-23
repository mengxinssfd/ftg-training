import {
  Direct,
  InputManager,
  Player,
  PlayerLocation,
  SkillManager,
  KeyboardInput,
  presetDirects,
} from '../src';
import type { Skill } from '../src';
import { DynamicEnum } from '@tool-pack/basic';

enum OtherKeys {
  LP = 'lp',
  MP = 'mp',
  HP = 'hp',
  LK = 'lk',
  MK = 'mk',
  HK = 'hk',
}

const keyboardMap = new DynamicEnum(
  new Map<Direct | string, string>([
    [Direct.Up, 'KeyW'],
    [Direct.Left, 'KeyA'],
    [Direct.Down, 'KeyS'],
    [Direct.Right, 'KeyD'],

    [OtherKeys.LP, 'KeyU'],
    [OtherKeys.MP, 'KeyI'],
    [OtherKeys.HP, 'KeyO'],
    [OtherKeys.LK, 'KeyJ'],
    [OtherKeys.MK, 'KeyK'],
    [OtherKeys.HK, 'KeyL'],
  ]),
);

function input(value: string, type: 'down' | 'up') {
  const event = new Event(type === 'up' ? 'keyup' : 'keydown');
  (event as any).key = value;
  window.dispatchEvent(event);
}

const Hadouken: Skill = {
  limitFrame: 20,
  matchPriority: 0,
  name: '波动拳',
  directs: [presetDirects['236']],
  trigger: OtherKeys.LP,
};

const Shoryuken: Skill = {
  matchPriority: 1,
  limitFrame: 20,
  name: '升龙拳',
  directs: [presetDirects['623'], presetDirects['323'], presetDirects['6236']],
  trigger: OtherKeys.LP,
};

describe('ftg-training-core', function () {
  (function () {
    if (!Set.prototype.union) {
      Set.prototype.union = function (other: Set<any>): Set<any> {
        const res = new Set(this);
        for (const o of other) {
          res.add(o);
        }
        return res;
      };
    }
  })();
  test('hadouken', () => {
    const player = new Player([Hadouken], [new KeyboardInput(keyboardMap)]);

    input('KeyS', 'down');
    player.frameAdd();
    input('KeyD', 'down');
    player.frameAdd();
    input('KeyS', 'up');
    player.frameAdd();
    input('KeyU', 'down');
    player.frameAdd();

    expect(player.matchSkill()).toBe(Hadouken);
  });
  test('shoryuken', () => {
    const ih = new InputManager([new KeyboardInput(keyboardMap)]);
    const sm = new SkillManager(ih);
    sm.registerSkills([Shoryuken, Hadouken]);

    input('KeyD', 'down');
    ih.frameAdd(PlayerLocation.Left, 1);
    input('KeyD', 'up');
    ih.frameAdd(PlayerLocation.Left, 2);
    input('KeyS', 'down');
    ih.frameAdd(PlayerLocation.Left, 3);
    input('KeyD', 'down');
    ih.frameAdd(PlayerLocation.Left, 4);
    input('KeyU', 'down');
    ih.frameAdd(PlayerLocation.Left, 5);

    expect(sm.match()).toBe(Shoryuken);
    expect(sm.match()).not.toBe(Hadouken);
  });
});
