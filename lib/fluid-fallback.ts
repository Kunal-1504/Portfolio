// A small 2D ribbon renderer for browsers without WebGL support.
export function createFluidFallback(container: HTMLElement) {
  container.replaceChildren();
  container.hidden = false;
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let frame = 0;
  let active = false;
  let inverted = true;
  let last = 0;
  const strokes: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    born: number;
    hue: number;
  }[] = [];

  function render(now: number) {
    frame = 0;
    if (!active || !ctx) return;
    if (now - last < 32) {
      frame = requestAnimationFrame(render);
      return;
    }
    last = now;
    if (
      canvas.width !== container.clientWidth ||
      canvas.height !== container.clientHeight
    ) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    ctx.fillStyle = inverted ? "#fff" : "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    while (strokes.length && now - strokes[0].born > 4200) strokes.shift();
    for (const stroke of strokes) {
      const age = (now - stroke.born) / 4200;
      const length = Math.min(
        160,
        Math.hypot(stroke.dx, stroke.dy) * 0.16 + 40,
      );
      const angle = Math.atan2(-stroke.dy, stroke.dx);
      ctx.save();
      ctx.translate(stroke.x, stroke.y);
      ctx.rotate(angle);
      ctx.globalAlpha = (1 - age) * 0.24;
      const bend = Math.sin(age * 5) * 70;
      for (let band = 6; band >= 0; band--) {
        ctx.beginPath();
        ctx.moveTo(-length * age, 0);
        ctx.bezierCurveTo(
          length * 0.2,
          bend,
          length * 0.6,
          -bend - 30,
          length,
          -bend,
        );
        ctx.bezierCurveTo(
          length + 55,
          -bend + 10,
          length + 25,
          -bend + 65,
          length - 10,
          -bend + 25,
        );
        ctx.lineWidth = 9 + band * 8;
        ctx.lineCap = "round";
        ctx.strokeStyle = `hsl(${(stroke.hue + band * 26) % 360} 90% ${inverted ? 78 : 55}%)`;
        ctx.stroke();
      }
      ctx.restore();
    }
    if (strokes.length) frame = requestAnimationFrame(render);
  }
  return {
    start() {
      if (!active) {
        active = true;
        frame = requestAnimationFrame(render);
      }
    },
    stop() {
      active = false;
      cancelAnimationFrame(frame);
    },
    setConfig(config: { inverted?: boolean }) {
      if (config.inverted !== undefined) inverted = config.inverted;
    },
    splatAtLocation(x: number, y: number, dx: number, dy: number) {
      if (!active) return;
      const now = performance.now();
      if (strokes.length && now - strokes[strokes.length - 1].born < 35) return;
      strokes.push({ x, y, dx, dy, born: now, hue: (now / 15) % 360 });
      if (strokes.length > 60) strokes.shift();
      if (!frame) frame = requestAnimationFrame(render);
    },
  };
}
