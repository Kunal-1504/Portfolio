"use client";

import { useEffect, useRef } from "react";

const colors = [
  "163, 117, 246",
  "100, 173, 250",
  "236, 132, 189",
  "244, 181, 113",
];

// Decorative only: no React updates, hit targets, or work while idle.
export function CursorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const surface = canvas;
    const ctx = context;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    let lastPaint = 0;
    let lastInput = 0;
    let lastSample = 0;
    let pointer = { x: width / 2, y: height / 2 };
    let hasPointer = false;
    let dark = document.documentElement.classList.contains("dark");
    const wisps: {
      x: number;
      y: number;
      born: number;
      color: string;
      drift: number;
    }[] = [];

    function clear() {
      cancelAnimationFrame(frame);
      frame = 0;
      wisps.length = 0;
      ctx.clearRect(0, 0, width, height);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      // Soft gradients need no retina-sized drawing buffer.
      const scale = Math.min(1, 1000 / width);
      surface.width = Math.round(width * scale);
      surface.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }

    function draw(now: number) {
      frame = 0;
      if (document.hidden || reducedMotion.matches) {
        clear();
        return;
      }
      if (now - lastPaint < 32) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastPaint = now;
      ctx.clearRect(0, 0, width, height);
      while (wisps.length && now - wisps[0].born > 1800) wisps.shift();
      for (const wisp of wisps) {
        const age = (now - wisp.born) / 1800;
        const radius = Math.min(width * 0.45, 230) * (0.8 + age * 0.65);
        const y = wisp.y - age * wisp.drift;
        const alpha = (dark ? 0.13 : 0.15) * Math.pow(1 - age, 2);
        const gradient = ctx.createRadialGradient(
          wisp.x,
          y,
          0,
          wisp.x,
          y,
          radius,
        );
        gradient.addColorStop(0, `rgba(${wisp.color}, ${alpha})`);
        gradient.addColorStop(0.45, `rgba(${wisp.color}, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${wisp.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(wisp.x - radius, y - radius, radius * 2, radius * 2);
      }
      if (wisps.length) frame = requestAnimationFrame(draw);
    }

    function addWisp(x: number, y: number, drift = 35) {
      if (reducedMotion.matches || document.hidden) return;
      const now = performance.now();
      if (now - lastSample < 45) return;
      lastSample = now;
      wisps.push({
        x,
        y,
        born: now,
        color: colors[Math.floor(now / 450) % colors.length],
        drift,
      });
      if (wisps.length > 24) wisps.shift();
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function move(event: PointerEvent) {
      pointer = { x: event.clientX, y: event.clientY };
      hasPointer = true;
      lastInput = performance.now();
      addWisp(pointer.x, pointer.y);
    }

    function scroll() {
      const recentPointer = hasPointer && performance.now() - lastInput < 5000;
      addWisp(
        recentPointer
          ? pointer.x
          : width * (0.5 + Math.sin(window.scrollY / 450) * 0.25),
        recentPointer ? pointer.y : height * 0.65,
        85,
      );
    }

    function visibility() {
      if (document.hidden) clear();
    }
    function theme() {
      dark = document.documentElement.classList.contains("dark");
    }

    resize();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("theme-change", theme);
    document.addEventListener("visibilitychange", visibility);
    reducedMotion.addEventListener("change", clear);
    return () => {
      clear();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("theme-change", theme);
      document.removeEventListener("visibilitychange", visibility);
      reducedMotion.removeEventListener("change", clear);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="cursor-background" aria-hidden="true" />
  );
}
