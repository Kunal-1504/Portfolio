"use client";

import { useEffect, useRef } from "react";
import type WebGLFluidEnhanced from "webgl-fluid-enhanced";
import { createFluidFallback } from "@/lib/fluid-fallback";

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
    let previous: { x: number; y: number; time: number } | undefined;
    let lastSplat = 0;
    let lastScroll = window.scrollY;

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
        return;
      }
      if (!fluid && !loading) {
        loading = true;
        try {
          const { default: Fluid } = await import("webgl-fluid-enhanced");
          if (disposed || reduced.matches || document.hidden) return;
          const simulation = new Fluid(container!);
          fluid = simulation;
          simulation.setConfig({
            simResolution: 128,
            dyeResolution: window.innerWidth < 640 ? 512 : 1024,
            densityDissipation: 1.1,
            velocityDissipation: 0.22,
            pressure: 0.8,
            pressureIterations: 16,
            curl: 30,
            splatRadius: 0.18,
            brightness: 0.12,
            hover: false,
            shading: true,
            bloom: false,
            sunrays: false,
            transparent: false,
            backgroundColor: "#000000",
          });
          theme();
        } catch {
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
      const now = performance.now();
      if (now - lastSplat < 16) return;
      lastSplat = now;
      const canvas = container!.querySelector("canvas");
      if (!canvas) return;
      // The library expects buffer pixels for x, but CSS pixels for y.
      const scale = canvas.width / Math.max(1, canvas.clientWidth);
      fluid.splatAtLocation(
        x * scale,
        y,
        Math.max(-1400, Math.min(1400, dx)),
        Math.max(-1400, Math.min(1400, dy)),
      );
    }

    function move(event: PointerEvent) {
      const now = performance.now();
      const { clientX: x, clientY: y } = event;
      if (previous && now - previous.time < 250) {
        splat(x, y, (x - previous.x) * 15, (previous.y - y) * 15);
      }
      previous = { x, y, time: now };
    }

    function scroll() {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      const x = previous?.x ?? window.innerWidth * 0.75;
      const y = previous?.y ?? window.innerHeight * 0.55;
      splat(x, y, Math.sin(window.scrollY / 200) * 180, delta * 8);
    }

    void sync();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("theme-change", theme);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      disposed = true;
      fluid?.stop();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
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
