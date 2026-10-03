import assert from "node:assert/strict";
import test from "node:test";
import { FluidPointer } from "../lib/fluid-pointer";

test("the same movement produces the same trail at different mouse polling rates", () => {
  function stroke(events: number) {
    const pointer = new FluidPointer();
    pointer.move(100, 100, 0);
    for (let i = 1; i <= events; i++)
      pointer.move(100 + (120 * i) / events, 160, (16 * i) / events);
    return pointer.drain();
  }
  assert.deepEqual(stroke(2), stroke(16));
  const points = stroke(16);
  assert.equal(points.at(-1)?.x, 220);
  assert.equal(points.at(-1)?.y, 160);
  assert.ok(points.length <= 6);
});

test("an idle pointer or re-entry never paints a long jump across the page", () => {
  const pointer = new FluidPointer();
  pointer.move(0, 0, 0);
  pointer.move(800, 600, 1000);
  assert.deepEqual(pointer.drain(), []);
  pointer.move(810, 600, 1010);
  assert.equal(pointer.drain().length, 1);
  assert.deepEqual(pointer.drain(), []);
  pointer.reset();
  pointer.move(10, 10, 1020);
  assert.deepEqual(pointer.drain(), []);
});

test("fast movement is interpolated with bounded total force", () => {
  const pointer = new FluidPointer();
  pointer.move(0, 0, 0);
  pointer.move(2000, 1000, 16);
  const points = pointer.drain();
  assert.equal(points.length, 6);
  const dx = points.reduce((sum, point) => sum + point.dx, 0);
  const dy = points.reduce((sum, point) => sum + point.dy, 0);
  assert.ok(Math.hypot(dx, dy) <= 1800.001);
});
