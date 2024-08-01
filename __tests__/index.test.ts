import { InputManager, SkillManager, AllKeys, Hadouken, Shoryuken } from '../src';

describe('fighting-game-control-system', function () {
  test('hadouken', () => {
    const ih = new InputManager();
    ih.registerKeys(AllKeys);
    const sm = new SkillManager();
    const hadouken = new Hadouken();
    sm.registerSkills([hadouken]);

    ih.input('s', 'down');
    ih.input('d', 'down');
    ih.input('s', 'up');
    ih.input('u', 'down');

    expect(sm.match(ih)).toBe(hadouken);
  });
  test('shoryuken', () => {
    const ih = new InputManager();
    ih.registerKeys(AllKeys);
    const sm = new SkillManager();
    const shoryuken = new Shoryuken();
    const hadouken = new Hadouken();
    sm.registerSkills([shoryuken, hadouken]);

    ih.input('d', 'down');
    ih.input('d', 'up');
    ih.input('s', 'down');
    ih.input('d', 'down');
    ih.input('u', 'down');

    expect(sm.match(ih)).toBe(shoryuken);
    expect(sm.match(ih)).not.toBe(hadouken);
  });
});
