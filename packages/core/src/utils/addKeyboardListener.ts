import { addObsListener } from './addObsListener';
import { emptyFn } from '@tool-pack/basic';

/**
 * 添加键盘事件监听器来跟踪按键按下和释放事件，当事件发生时会调用回调函数，
 * 并传入按键码、按压状态和可选的事件数据。同时无缝管理本地和远程(OBS)事件监听。
 *
 * @param {function(string, boolean, KeyboardEvent=): void} callback - 当按键被按下或释放时执行的函数。该函数接收三个参数：按键码(字符串)、按压状态(布尔值)和可选的键盘事件对象。
 * @param {EventListenerOptions} [options] - 可选的事件监听器选项，例如 `capture`、`once` 和 `passive`。
 * @return {function(): void} 返回一个清理函数，用于移除键盘事件监听器。
 */
export function addKeyboardListener(
  callback: (keycode: string, isPressed: boolean, e?: KeyboardEvent) => void,
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
