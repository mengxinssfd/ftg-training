import { DynamicEnum } from '@tool-pack/basic';
import type { KeyOfKeymap } from '@core';
import type { KeymapArrayType } from './types';

interface SaveData {
  version: number;
  keymap: KeymapArrayType;
}
const version = 0;
export function saveKeymap(
  dynamicEnum: DynamicEnum<KeyOfKeymap, string | number>,
  key: string,
): void {
  const km: KeymapArrayType = dynamicEnum.map((v, k) => [k, v]);
  const obj: SaveData = { version, keymap: km };
  localStorage.setItem(key, JSON.stringify(obj));
}
export function loadKeymap(key: string, def: KeymapArrayType): KeymapArrayType {
  const localMap = localStorage.getItem(key);
  if (!localMap) return def;
  try {
    const obj = JSON.parse(localMap) as SaveData;
    // 如果数据结构变了要在此转换
    if (obj.version === 0) return obj.keymap;
    return def;
  } catch (e) {
    return def;
  }
}
export function resetKeymap(
  dynamicEnum: DynamicEnum<KeyOfKeymap, string | number>,
  defKeymapArr: KeymapArrayType,
): void {
  const realKeyMap = new Map<string, KeyOfKeymap>();
  const strMap = new Map<string, string | number>();
  // 经过 local storage 保存后 key 如果是数组直接取是对不上的，要经过序列化转换一下
  dynamicEnum.forEach((v, k) => {
    const strKey = JSON.stringify(k);
    strMap.set(strKey, v);
    realKeyMap.set(strKey, k);
  });
  defKeymapArr.forEach(([k, v]) => {
    const strKey = JSON.stringify(k);
    if (strMap.get(strKey) !== v) dynamicEnum.set(realKeyMap.get(strKey) as KeyOfKeymap, v);
  });
}
export function resetKeymapWithSaved(
  dynamicEnum: DynamicEnum<KeyOfKeymap, string | number>,
  key: string,
  def: KeymapArrayType,
): void {
  resetKeymap(dynamicEnum, loadKeymap(key, def));
}
