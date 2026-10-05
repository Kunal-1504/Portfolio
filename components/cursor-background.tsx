"use client";

import { useEffect, useRef } from "react";
import type WebGLFluidEnhanced from "webgl-fluid-enhanced";
import { createFluidFallback } from "@/lib/fluid-fallback";
import { FluidPointer } from "@/lib/fluid-pointer";

// The fluid lives behind the page; global pointer listeners keep links clickable.
export function CursorBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let fluid:
      WebGLFluidEnhanced | ReturnType<typeof createFluidFallback> | undefined;
    let disposed = false;
    let loading = false;
    let running = false;
    const pointer = new FluidPointer();
    let inputFrame = 0;
    let hardware = false;

    function resize() {
      // Bound the display buffer to roughly one pixel per CSS pixel, even on
      // Retina screens. The dye simulation has its own independent resolution.
      const scale = hardware
        ? Math.max(1, window.devicePixelRatio || 1, window.innerWidth / 1600)
        : 1;
      container!.style.width = `${100 / scale}%`;
      container!.style.height = `${100 / scale}%`;
      container!.style.transformOrigin = "top left";
      container!.style.transform = `scale(${scale})`;
    }

    function theme() {
      fluid?.setConfig({
        inverted: !document.documentElement.classList.contains("dark"),
      });
    }

    async function sync() {
      if (disposed) return;
      if (reduced.matches || document.hidden) {
        fluid?.stop();
        running = false;
        pointer.reset();
        cancelAnimationFrame(inputFrame);
        inputFrame = 0;
        return;
      }
      if (!fluid && !loading) {
        loading = true;
        try {
          const { default: Fluid } = await import("webgl-fluid-enhanced");
          if (disposed || reduced.matches || document.hidden) return;
          hardware = true;
          resize();
          const simulation = new Fluid(container!);
          fluid = simulation;
          simulation.setConfig({
            simResolution: 128,
            dyeResolution: window.innerWidth < 640 ? 512 : 768,
            densityDissipation: 1.6,
            velocityDissipation: 0.65,
            pressure: 0.8,
            pressureIterations: 12,
            curl: 8,
            splatRadius: 0.3,
            brightness: 0.12,
            hover: false,
            shading: false,
            bloom: false,
            sunrays: false,
            transparent: false,
            backgroundColor: "#000000",
          });
          simulation.start();
          running = true;
          container!.dataset.renderer = "webgl";
          theme();
        } catch {
          fluid?.stop();
          hardware = false;
          resize();
          container!.dataset.renderer = "canvas";
          fluid = createFluidFallback(container!);
          theme();
        } finally {
          loading = false;
        }
      }
      if (fluid && !running) {
        fluid.start();
        running = true;
      }
    }

    function splat(x: number, y: number, dx: number, dy: number) {
      if (!fluid || !running || reduced.matches) return;
      const canvas = container!.querySelector("canvas");
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      // The library mixes buffer coordinates for x with layout pixels for y.
      // Keep neighboring splats the same hue instead of randomizing every event.
      const hue = performance.now() / 4500;
      const color =
        "#" +
        [0, 2.094, 4.189]
          .map((phase) =>
            Math.round((Math.sin(hue + phase) + 1) * 8)
              .toString(16)
              .padStart(2, "0"),
          )
          .join("");
      fluid.splatAtLocation(
        ((x - bounds.left) / bounds.width) * canvas.width,
        ((y - bounds.top) / bounds.height) * canvas.clientHeight,
        Math.max(-600, Math.min(600, dx * 0.45)),
        Math.max(-600, Math.min(600, dy * 0.45)),
        color,
      );
    }

    function flush() {
      inputFrame = 0;
      for (const point of pointer.drain()) {
        splat(point.x, point.y, point.dx, point.dy);
      }
    }

    function schedule() {
      if (!inputFrame && running) inputFrame = requestAnimationFrame(flush);
    }

    function move(event: PointerEvent) {
      if (reduced.matches || document.hidden || !running) return;
      pointer.move(event.clientX, event.clientY, performance.now());
      schedule();
    }

    function leave() {
      pointer.reset();
    }

    void sync();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("theme-change", theme);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      disposed = true;
      fluid?.stop();
      cancelAnimationFrame(inputFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("theme-change", theme);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      const canvas = container.querySelector("canvas");
      const gl = canvas?.getContext("webgl2") || canvas?.getContext("webgl");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="cursor-background" aria-hidden="true">
      <div ref={containerRef} className="fluid-surface" />
    </div>
  );
}
