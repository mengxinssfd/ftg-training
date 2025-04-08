import { addObsListener } from './addObsListener';
import { emptyFn } from '@tool-pack/basic';

export function addKeyboardListener(
  callback: (keycode: string, isPressed: boolean, e?: KeyboardEvent) => any,
  options?: EventListenerOptions,
): () => void {
  let closed = false;
  let localCanceler = addLocalListener();
  const channel = { close: emptyFn };
  addObsListener({
    channel,
    callback,
    onopen: (): void => {
      // 打开obs时取消本地键盘事件监听
      localCanceler();
    },
    onerror: (): void => {
      if (closed) return;
      // obs关闭时开启本地键盘事件监听
      if (localCanceler === emptyFn) localCanceler = addLocalListener();
    },
  });

  return (): void => {
    closed = true;
    localCanceler();
    channel.close();
  };

  function addLocalListener(): () => void {
    // console.log('addLocalListener');
    const kd = (e: KeyboardEvent): void => callback(getKeyboardKey(e), true, e);
    const ku = (e: KeyboardEvent): void => callback(getKeyboardKey(e), false, e);
    window.addEventListener('keydown', kd, options);
    window.addEventListener('keyup', ku, options);
    return (): void => {
      // console.log('removeLocalListener');
      window.removeEventListener('keydown', kd, options);
      window.removeEventListener('keyup', ku, options);
      localCanceler = emptyFn;
    };
    function getKeyboardKey(e: KeyboardEvent): string {
      let key = e.key;
      if (key === ' ') key = 'space';
      return key;
    }
  }
}
