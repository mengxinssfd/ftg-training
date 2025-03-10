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

enum OtherKeys {
  LP = 'lp',
  MP = 'mp',
  HP = 'hp',
  LK = 'lk',
  MK = 'mk',
  HK = 'hk',
}

const map = {
  w: Direct.Up,
  a: Direct.Left,
  s: Direct.Down,
  d: Direct.Right,

  u: OtherKeys.LP,
  i: OtherKeys.MP,
  o: OtherKeys.HP,
  j: OtherKeys.LK,
  k: OtherKeys.MK,
  l: OtherKeys.HK,
};

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
  test('hadouken', () => {
    const player = new Player([Hadouken], [new KeyboardInput(map)]);

    input('s', 'down');
    player.frameAdd();
    input('d', 'down');
    player.frameAdd();
    input('s', 'up');
    player.frameAdd();
    input('u', 'down');
    player.frameAdd();

    expect(player.matchSkill()).toBe(Hadouken);
  });
  test('shoryuken', () => {
    const ih = new InputManager([new KeyboardInput(map)]);
    const sm = new SkillManager(ih);
    sm.registerSkills([Shoryuken, Hadouken]);

    input('d', 'down');
    ih.frameAdd(PlayerLocation.Left, 1);
    input('d', 'up');
    ih.frameAdd(PlayerLocation.Left, 2);
    input('s', 'down');
    ih.frameAdd(PlayerLocation.Left, 3);
    input('d', 'down');
    ih.frameAdd(PlayerLocation.Left, 4);
    input('u', 'down');
    ih.frameAdd(PlayerLocation.Left, 5);

    expect(sm.match()).toBe(Shoryuken);
    expect(sm.match()).not.toBe(Hadouken);
  });
});
