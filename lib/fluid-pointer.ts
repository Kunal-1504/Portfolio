export type FluidPoint = { x: number; y: number };

// Consume movement once per display frame, regardless of the mouse polling rate.
export class FluidPointer {
  private origin?: FluidPoint;
  private target?: FluidPoint;
  private lastMove = 0;

  move(x: number, y: number, now: number) {
    if (!this.origin || now - this.lastMove > 180) this.origin = { x, y };
    this.target = { x, y };
    this.lastMove = now;
  }

  reset() {
    this.origin = this.target = undefined;
  }

  drain() {
    if (!this.origin || !this.target) return [];
    const start = this.origin;
    const end = this.target;
    this.origin = end;
    const dx = end.x - start.x;
    const dy = start.y - end.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.1) return [];
    const count = Math.min(6, Math.ceil(distance / 24));
    const force = Math.min(12, 1800 / distance) / count;
    return Array.from({ length: count }, (_, index) => ({
      x: start.x + (dx * (index + 1)) / count,
      y: start.y - (dy * (index + 1)) / count,
      dx: dx * force,
      dy: dy * force,
    }));
  }
}
