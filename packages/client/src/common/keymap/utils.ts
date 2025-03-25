import { DynamicEnum } from '@tool-pack/basic';
import type { KeyOfKeymap, MapArrayOfKeymap } from '@core';

export function resetKeymap(
  dynamicEnum: DynamicEnum<KeyOfKeymap, string | number>,
  defKeymapArr: MapArrayOfKeymap,
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
