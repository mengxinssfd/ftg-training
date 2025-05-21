import { ObsKeycodes } from '@core';
import { emptyFn } from '@tool-pack/basic';

/**
 * 通过 WebSocket 连接注册一个监听器用于观察按键相关事件。
 *
 * @param {Object} options - 监听器的配置对象
 * @param {Function} options.callback - 当按键事件发生时被调用的函数。接收按键码和其按压状态作为参数
 * @param {Function} [options.onclose] - WebSocket 连接关闭时触发的回调函数
 * @param {Function} [options.onerror] - WebSocket 连接发生错误时触发的回调函数
 * @param {Function} [options.onopen] - WebSocket 连接成功打开时触发的回调函数
 * @param {Object} [options.channel] - 可用于手动关闭 WebSocket 连接的通道对象。必须包含 `close` 方法
 * @return {void} 此函数没有返回值
 */
export function addObsListener({
  callback,
  onclose,
  onerror,
  onopen = null,
  channel,
}: {
  callback: (keycode: string, isPressed: boolean) => void;
  onclose?: typeof WebSocket.prototype.onclose;
  onerror?: typeof WebSocket.prototype.onerror;
  onopen?: typeof WebSocket.prototype.onopen;
  channel?: { close: () => void };
}): void {
  let closed = false;
  startWebsocket();
  function onKeyEvent(data?: { event_type: string; keycode: string }): void {
    if (!data || !data.event_type) return;
    if (data.event_type === 'key_typed') return;
    // Interpret mouse events
    if (data.event_type.startsWith('mouse')) return;
    // Keyboard event
    const value = ObsKeycodes[data.keycode];
    if (value) {
      // Prevents white space from unassigned keycodes
      callback(value[1].toLowerCase(), data.event_type === 'key_pressed');
    }
  }
  function startWebsocket() {
    if (closed) return;
    let ws: WebSocket | null = new WebSocket('ws://localhost:16899/');
    ws.onmessage = (e) => onKeyEvent(JSON.parse(e.data));
    ws.onerror = function (e): void {
      console.log('WebSocket error: ');
      // console.error(e);
      onerror?.call(this, e);
    };
    ws.onopen = onopen;
    ws.onclose = function (e): void {
      onclose?.call(this, e);
      setTimeout(startWebsocket, 2000);
    };
    if (channel) {
      channel.close = (): void => {
        closed = true;
        if (!ws) return;
        // 事件带重连，关闭前需要先移除事件
        ws.onclose = null;
        const CLOSE_NORMAL = 1000;
        ws.close(CLOSE_NORMAL, 'close');
        ws = null;
        channel.close = emptyFn;
      };
    }
  }
}
