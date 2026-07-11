export const REFERENCE_RENDER_SCALE = 0.5;

export function getReferenceRenderSize(cssWidth: number, cssHeight: number) {
  return {
    width: Math.max(1, Math.round(Math.max(0, cssWidth) * REFERENCE_RENDER_SCALE)),
    height: Math.max(1, Math.round(Math.max(0, cssHeight) * REFERENCE_RENDER_SCALE)),
  };
}

export function createSingleFrameScheduler(
  requestFrame: (callback: FrameRequestCallback) => number,
  cancelFrame: (handle: number) => void,
  draw: FrameRequestCallback,
) {
  let frameHandle: number | null = null;
  let active = false;
  let disposed = false;

  const schedule = () => {
    if (!active || disposed || frameHandle !== null) {
      return;
    }

    frameHandle = requestFrame(tick);
  };

  const tick: FrameRequestCallback = (time) => {
    frameHandle = null;

    if (!active || disposed) {
      return;
    }

    draw(time);
    schedule();
  };

  const pause = () => {
    active = false;

    if (frameHandle !== null) {
      cancelFrame(frameHandle);
      frameHandle = null;
    }
  };

  return {
    destroy() {
      pause();
      disposed = true;
    },
    pause,
    resume() {
      if (disposed) {
        return;
      }

      active = true;
      schedule();
    },
  };
}
