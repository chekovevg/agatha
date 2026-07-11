import {describe, expect, it} from "vitest";

import {
  createSingleFrameScheduler,
  getReferenceRenderSize,
} from "@/components/ui/reference-webgl/runtime";

describe("reference WebGL runtime", () => {
  it("renders at half CSS resolution with safe minimum dimensions", () => {
    expect(getReferenceRenderSize(1440, 900)).toEqual({width: 720, height: 450});
    expect(getReferenceRenderSize(390, 844)).toEqual({width: 195, height: 422});
    expect(getReferenceRenderSize(0, -20)).toEqual({width: 1, height: 1});
  });

  it("keeps at most one animation frame pending", () => {
    let nextHandle = 1;
    const callbacks = new Map<number, FrameRequestCallback>();
    const cancelled: number[] = [];
    const frames: number[] = [];

    const requestFrame = (callback: FrameRequestCallback) => {
      const handle = nextHandle++;
      callbacks.set(handle, callback);
      return handle;
    };
    const cancelFrame = (handle: number) => {
      cancelled.push(handle);
      callbacks.delete(handle);
    };
    const scheduler = createSingleFrameScheduler(
      requestFrame,
      cancelFrame,
      (time) => frames.push(time),
    );

    scheduler.resume();
    scheduler.resume();
    expect(callbacks.size).toBe(1);

    const [[handle, callback]] = callbacks;
    callbacks.delete(handle);
    callback(16);

    expect(frames).toEqual([16]);
    expect(callbacks.size).toBe(1);

    scheduler.pause();
    expect(callbacks.size).toBe(0);
    expect(cancelled).toHaveLength(1);

    scheduler.resume();
    expect(callbacks.size).toBe(1);
    scheduler.destroy();
    expect(callbacks.size).toBe(0);

    scheduler.resume();
    expect(callbacks.size).toBe(0);
  });
});
