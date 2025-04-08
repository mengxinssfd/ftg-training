import { ObsKeycodes } from '@core';
import { emptyFn } from '@tool-pack/basic';

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
