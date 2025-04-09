import { useEffect, useRef } from 'react';

export function HitBox({ onInput }: { onInput: (input: Set<number>) => void }) {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement?.clientWidth || 0;
    canvas.height = canvas.parentElement?.clientHeight || 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 创建圆形
    const radius = 50;
    const width = 100;
    const space = 38;
    const buttons = (
      [
        [space + radius, 70 + radius],
        [width + space * 2 + radius, 80 + radius],
        [width * 2 + space * 3 + radius, 120 + radius],
        [width * 3 + space * 4 + radius, 380 + radius],

        [width * 4 + space * 5 + radius, 120 + radius],
        [width * 5 + space * 6 + radius, 120 + radius - 40],
        [width * 6 + space * 7 + radius, 120 + radius - 50],

        [width * 4 + space * 5 + radius, 120 + radius + width + space],
        [width * 5 + space * 6 + radius, 120 + radius - 40 + width + space],
        [width * 6 + space * 7 + radius, 120 + radius - 50 + width + space],
      ] satisfies [x: number, y: number][]
    ).map(([x, y]) => {
      const p = new Path2D();
      p.arc(x, y, radius, 0, 2 * Math.PI);
      return p;
    });
    ctx.fillStyle = 'pink';
    buttons.forEach((b) => ctx.fill(b));
    canvas.addEventListener('touchmove', eventHandler);
    canvas.addEventListener('touchstart', eventHandler);
    canvas.addEventListener('touchend', eventHandler);
    canvas.addEventListener('touchcancel', eventHandler);

    const findHitIndexes = (ts: TouchList): Set<number> => {
      const indexes = new Set<number>();
      for (let i = 0; i < ts.length; i++) {
        const index = findHitIndex(ts[i] as Touch);
        if (index > -1) indexes.add(index);
      }
      return indexes;
    };
    const findHitIndex = (tc: Touch): number => {
      const rect = canvas.getBoundingClientRect();
      const offsetX = tc.clientX - rect.left;
      const offsetY = tc.clientY - rect.top;
      return buttons.findIndex((b) => ctx.isPointInPath(b, offsetX, offsetY));
    };
    return () => {
      canvas.removeEventListener('touchmove', eventHandler);
      canvas.removeEventListener('touchstart', eventHandler);
      canvas.removeEventListener('touchend', eventHandler);
      canvas.removeEventListener('touchcancel', eventHandler);
    };
    function eventHandler(event: TouchEvent): void {
      onInput(findHitIndexes(event.touches));
    }
  }, []);

  return <canvas ref={canRef}>该浏览器不支持 canvas 元素</canvas>;
}
