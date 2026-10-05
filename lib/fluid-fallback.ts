// A bounded, low-resolution fluid field for devices without WebGL. Velocity and
// dye are advected together, so trails remain connected instead of stamping blobs.
export function createFluidFallback(container: HTMLElement) {
  container.replaceChildren();
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d", { alpha: false });
  const buffer = document.createElement("canvas");
  const paint = buffer.getContext("2d", { alpha: false });
  let width = 0,
    height = 0,
    size = 0;
  let u: Float32Array,
    v: Float32Array,
    nextU: Float32Array,
    nextV: Float32Array;
  let red: Float32Array, green: Float32Array, blue: Float32Array;
  let nextR: Float32Array, nextG: Float32Array, nextB: Float32Array;
  let pressure: Float32Array, divergence: Float32Array;
  let pixels: ImageData;
  let frame = 0,
    last = 0,
    lastInput = 0;
  let active = false,
    inverted = true;

  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    if (canvas.width === w && canvas.height === h && size) return;
    canvas.width = w;
    canvas.height = h;
    const scale = 180 / Math.max(w, h);
    width = Math.max(24, Math.round(w * scale));
    height = Math.max(24, Math.round(h * scale));
    buffer.width = width;
    buffer.height = height;
    size = width * height;
    [
      u,
      v,
      nextU,
      nextV,
      red,
      green,
      blue,
      nextR,
      nextG,
      nextB,
      pressure,
      divergence,
    ] = Array.from({ length: 12 }, () => new Float32Array(size));
    pixels = new ImageData(width, height);
  }

  function sample(field: Float32Array, x: number, y: number) {
    x = Math.max(0, Math.min(width - 1.001, x));
    y = Math.max(0, Math.min(height - 1.001, y));
    const ix = Math.floor(x),
      iy = Math.floor(y);
    const fx = x - ix,
      fy = y - iy,
      i = ix + iy * width;
    return (
      (field[i] * (1 - fx) + field[i + 1] * fx) * (1 - fy) +
      (field[i + width] * (1 - fx) + field[i + width + 1] * fx) * fy
    );
  }

  function render(now: number) {
    frame = 0;
    if (!active || !ctx || !paint) return;
    resize();
    const dt = Math.min(0.025, (now - (last || now - 16)) / 1000);
    last = now;
    const velocityFade = Math.exp(-dt * 0.65);
    const dyeFade = Math.exp(-dt * 1.6);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = x + y * width;
        const sx = x - u[i] * dt,
          sy = y - v[i] * dt;
        nextU[i] = sample(u, sx, sy) * velocityFade;
        nextV[i] = sample(v, sx, sy) * velocityFade;
        nextR[i] = sample(red, sx, sy) * dyeFade;
        nextG[i] = sample(green, sx, sy) * dyeFade;
        nextB[i] = sample(blue, sx, sy) * dyeFade;
      }
    }
    [u, nextU] = [nextU, u];
    [v, nextV] = [nextV, v];
    [red, nextR] = [nextR, red];
    [green, nextG] = [nextG, green];
    [blue, nextB] = [nextB, blue];
    // Vorticity confinement restores the small curls lost during advection.
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = x + y * width;
        divergence[i] =
          (v[i + 1] - v[i - 1] - u[i + width] + u[i - width]) * 0.5;
      }
    }
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        const i = x + y * width;
        const gx = Math.abs(divergence[i + 1]) - Math.abs(divergence[i - 1]);
        const gy =
          Math.abs(divergence[i + width]) - Math.abs(divergence[i - width]);
        const force = (dt * 3 * divergence[i]) / (Math.hypot(gx, gy) + 0.001);
        u[i] = Math.max(-180, Math.min(180, u[i] + gy * force));
        v[i] = Math.max(-180, Math.min(180, v[i] - gx * force));
      }
    }
    pressure.fill(0);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = x + y * width;
        divergence[i] =
          (u[i + 1] - u[i - 1] + v[i + width] - v[i - width]) * 0.5;
      }
    }
    for (let iteration = 0; iteration < 8; iteration++) {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const i = x + y * width;
          pressure[i] =
            (pressure[i - 1] +
              pressure[i + 1] +
              pressure[i - width] +
              pressure[i + width] -
              divergence[i]) *
            0.25;
        }
      }
    }
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = x + y * width;
        u[i] -= (pressure[i + 1] - pressure[i - 1]) * 0.5;
        v[i] -= (pressure[i + width] - pressure[i - width]) * 0.5;
      }
    }
    for (let i = 0; i < size; i++) {
      const r = Math.min(255, red[i] * 255),
        g = Math.min(255, green[i] * 255),
        b = Math.min(255, blue[i] * 255);
      pixels.data[i * 4] = inverted ? 255 - r : r;
      pixels.data[i * 4 + 1] = inverted ? 255 - g : g;
      pixels.data[i * 4 + 2] = inverted ? 255 - b : b;
      pixels.data[i * 4 + 3] = 255;
    }
    paint.putImageData(pixels, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
    if (now - lastInput < 9000) frame = requestAnimationFrame(render);
    else {
      // Clear the final faint dye before sleeping until the next interaction.
      red.fill(0);
      green.fill(0);
      blue.fill(0);
      u.fill(0);
      v.fill(0);
      ctx.fillStyle = inverted ? "#fff" : "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    start() {
      if (active) return;
      active = true;
      last = 0;
      frame = requestAnimationFrame(render);
    },
    stop() {
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
    },
    setConfig(config: { inverted?: boolean }) {
      if (config.inverted !== undefined) inverted = config.inverted;
      if (active && !frame) frame = requestAnimationFrame(render);
    },
    splatAtLocation(x: number, y: number, dx: number, dy: number) {
      if (!active) return;
      resize();
      lastInput = performance.now();
      const px = (x / canvas.width) * width;
      const py = (y / canvas.clientHeight) * height;
      const radius = 4.8;
      const hue = lastInput / 4500;
      const color = [0, 2.094, 4.189].map(
        (phase) => (Math.sin(hue + phase) + 1) * 0.09,
      );
      for (
        let iy = Math.max(0, Math.floor(py - radius * 3));
        iy < Math.min(height, py + radius * 3);
        iy++
      ) {
        for (
          let ix = Math.max(0, Math.floor(px - radius * 3));
          ix < Math.min(width, px + radius * 3);
          ix++
        ) {
          const i = ix + iy * width;
          const amount = Math.exp(
            -((ix - px) ** 2 + (iy - py) ** 2) / (radius * radius),
          );
          u[i] += dx * amount * 0.035;
          v[i] -= dy * amount * 0.035;
          red[i] = Math.min(0.55, red[i] + color[0] * amount);
          green[i] = Math.min(0.55, green[i] + color[1] * amount);
          blue[i] = Math.min(0.55, blue[i] + color[2] * amount);
        }
      }
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(render);
      }
    },
  };
}
