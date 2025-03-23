import type { KeymapArrayType } from '@/common/keymap/types';
import { OtherKeys } from '@/common';

export const emptyKeymap: KeymapArrayType = [
  // 投
  [[OtherKeys.LK, OtherKeys.LP], ''],
  // 3p
  [[OtherKeys.LP, OtherKeys.MP, OtherKeys.HP], ''],
  // 3k
  [[OtherKeys.LK, OtherKeys.MK, OtherKeys.HK], ''],
];
