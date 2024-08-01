import { type Key, type DirectKey, KeyType } from '../types';

export const None: DirectKey = {
  name: 'None',
  map: '',
  icon: 'N',
  type: KeyType.Direct,
};

export const Up: DirectKey = {
  name: 'Up',
  map: 'w',
  icon: '↑',
  type: KeyType.Direct,
  match(h): Key {
    const dk = h.downKeyMap;
    if (dk.has(Down)) return None;
    if (dk.has(Left)) return UpLeft;
    if (dk.has(Right)) return UpRight;
    return Up;
  },
};
export const Down: DirectKey = {
  name: 'Down',
  map: 's',
  icon: '↓',
  type: KeyType.Direct,
  match(h): Key {
    const dk = h.downKeyMap;
    if (dk.has(Up)) return None;
    if (dk.has(Left)) return DownLeft;
    if (dk.has(Right)) return DownRight;
    return Down;
  },
};
export const Left: DirectKey = {
  name: 'Left',
  map: 'a',
  icon: '←',
  type: KeyType.Direct,
  match(h): Key {
    const dk = h.downKeyMap;
    if (dk.has(Right)) return None;
    if (dk.has(Up)) return UpLeft;
    if (dk.has(Down)) return DownLeft;
    return Left;
  },
};
export const Right: DirectKey = {
  name: 'Right',
  map: 'd',
  icon: '→',
  type: KeyType.Direct,
  match(h): Key {
    const dk = h.downKeyMap;
    if (dk.has(Left)) return None;
    if (dk.has(Up)) return UpRight;
    if (dk.has(Down)) return DownRight;
    return Right;
  },
};

export const UpLeft: DirectKey = {
  name: 'UpLeft',
  map: 'wa',
  icon: '↖',
  type: KeyType.Direct,
  match(h): Key {
    const dk = h.downKeyMap;
    if (!dk.has(Up)) return Left;
    if (!dk.has(Left)) return Up;
    return UpLeft;
  },
};
export const UpRight: DirectKey = {
  name: 'UpRight',
  map: 'wd',
  icon: '↗',
  type: KeyType.Direct,
  match(h): Key {
    const dk = h.downKeyMap;
    if (!dk.has(Up)) return Right;
    if (!dk.has(Right)) return Up;
    return UpRight;
  },
};
export const DownLeft: DirectKey = {
  name: 'DownLeft',
  map: 'as',
  icon: '↙',
  type: KeyType.Direct,
  match(h): Key {
    const dk = h.downKeyMap;
    if (!dk.has(Down)) return Left;
    if (!dk.has(Left)) return Down;
    return DownLeft;
  },
};
export const DownRight: DirectKey = {
  name: 'DownRight',
  map: 'sd',
  icon: '↘',
  type: KeyType.Direct,
  match(h): Key {
    const dk = h.downKeyMap;
    if (!dk.has(Down)) return Right;
    if (!dk.has(Right)) return Down;
    return DownRight;
  },
};
