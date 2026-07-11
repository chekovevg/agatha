import type {Page} from "playwright/test";

export type ReferenceWebGLProbeOptions = {
  failFirstRenderTargetResize?: boolean;
  intersectionMode?: "controlled" | "missing" | "native";
  webglMode?: "normal" | "null" | "throw";
};

export type ReferenceWebGLProbeSnapshot = {
  activeListeners: number;
  clearedScrollTimers: number;
  contextCalls: number;
  deletions: Record<string, number>;
  drawCount: number;
  heldScrollTimers: number;
  intersectionDisconnects: number;
  pointerUniforms: Array<{name: string; x: number; y: number}>;
  removedListeners: number;
  resizeDisconnects: number;
  visibility: "hidden" | "visible";
};

type ProbeController = {
  emitIntersection(isIntersecting: boolean): void;
  releaseScrollTimers(): void;
  setVisibility(visibility: "hidden" | "visible"): void;
  snapshot(): ReferenceWebGLProbeSnapshot;
};

type ProbeWindow = Window & {
  __referenceWebGLProbe?: ProbeController;
};

export async function installReferenceWebGLProbe(
  page: Page,
  options: ReferenceWebGLProbeOptions = {},
) {
  await page.addInitScript(
    ({failFirstRenderTargetResize, intersectionMode, webglMode}) => {
      const selector = ".reference-webgl-hero-canvas";
      const metrics = {
        clearedScrollTimers: 0,
        contextCalls: 0,
        deletions: {
          buffer: 0,
          framebuffer: 0,
          program: 0,
          shader: 0,
          texture: 0,
          vertexArray: 0,
        },
        drawCount: 0,
        intersectionDisconnects: 0,
        pointerUniforms: [] as Array<{name: string; x: number; y: number}>,
        removedListeners: 0,
        resizeDisconnects: 0,
        visibility: "visible" as "hidden" | "visible",
      };
      const referenceContexts = new WeakSet<WebGL2RenderingContext>();
      const uniformNames = new WeakMap<WebGLUniformLocation, string>();
      const controlledIntersections = new Set<{
        emit(isIntersecting: boolean): void;
      }>();
      const NativeIntersectionObserver = window.IntersectionObserver;
      const heldTimers = new Map<
        number,
        {args: unknown[]; handler: TimerHandler}
      >();
      let nextHeldTimer = -1;
      let referenceIntersectionObserverMasked = false;
      let renderTargetResizeFailed = false;

      const restoreReferenceIntersectionObserver = () => {
        if (!referenceIntersectionObserverMasked) return;
        Object.defineProperty(window, "IntersectionObserver", {
          configurable: true,
          value: NativeIntersectionObserver,
          writable: true,
        });
        referenceIntersectionObserverMasked = false;
      };
      const maskReferenceIntersectionObserver = () => {
        if (
          intersectionMode !== "missing" ||
          referenceIntersectionObserverMasked
        ) {
          return;
        }
        delete (
          window as unknown as {IntersectionObserver?: typeof IntersectionObserver}
        ).IntersectionObserver;
        referenceIntersectionObserverMasked = true;
        queueMicrotask(restoreReferenceIntersectionObserver);
      };

      type ListenerRecord = {
        active: boolean;
        capture: boolean;
        listener: EventListenerOrEventListenerObject | null;
        target: EventTarget;
        type: string;
      };
      const listeners: ListenerRecord[] = [];

      const isReferenceCanvas = (value: unknown) =>
        value instanceof HTMLCanvasElement && value.matches(selector);
      const hasReferenceCanvas = () => document.querySelector(selector) !== null;
      const captureFrom = (
        options?: boolean | AddEventListenerOptions | EventListenerOptions,
      ) => (typeof options === "boolean" ? options : (options?.capture ?? false));
      const isReferenceListener = (target: EventTarget, type: string) => {
        if (
          isReferenceCanvas(target) &&
          (type === "webglcontextlost" || type === "webglcontextrestored")
        ) {
          return true;
        }
        if (
          target === window &&
          hasReferenceCanvas() &&
          (type === "pointermove" || type === "scroll")
        ) {
          return true;
        }
        if (
          target === document &&
          hasReferenceCanvas() &&
          type === "visibilitychange"
        ) {
          return true;
        }
        return (
          hasReferenceCanvas() &&
          typeof MediaQueryList !== "undefined" &&
          target instanceof MediaQueryList &&
          target.media === "(prefers-reduced-motion: reduce)" &&
          type === "change"
        );
      };

      const nativeAddEventListener = EventTarget.prototype.addEventListener;
      const nativeRemoveEventListener = EventTarget.prototype.removeEventListener;
      EventTarget.prototype.addEventListener = function (
        type,
        listener,
        options,
      ) {
        const referenceListener = isReferenceListener(this, type);
        if (referenceListener) {
          listeners.push({
            active: true,
            capture: captureFrom(options),
            listener,
            target: this,
            type,
          });
        }
        if (referenceListener) restoreReferenceIntersectionObserver();
        return Reflect.apply(nativeAddEventListener, this, [type, listener, options]);
      };
      EventTarget.prototype.removeEventListener = function (
        type,
        listener,
        options,
      ) {
        const capture = captureFrom(options);
        const record = listeners.findLast(
          (candidate) =>
            candidate.active &&
            candidate.target === this &&
            candidate.type === type &&
            candidate.listener === listener &&
            candidate.capture === capture,
        );
        if (record) {
          record.active = false;
          metrics.removedListeners += 1;
        }
        return Reflect.apply(nativeRemoveEventListener, this, [
          type,
          listener,
          options,
        ]);
      };

      const nativeGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        contextId: string,
        ...args: unknown[]
      ) {
        const isReferenceWebGL2 =
          contextId === "webgl2" && isReferenceCanvas(this);
        if (isReferenceWebGL2) {
          metrics.contextCalls += 1;
          if (webglMode === "null") return null;
          if (webglMode === "throw") {
            throw new Error("Reference WebGL probe context failure");
          }
        }
        const context = Reflect.apply(nativeGetContext, this, [contextId, ...args]);
        if (isReferenceWebGL2 && context instanceof WebGL2RenderingContext) {
          referenceContexts.add(context);
        }
        return context;
      } as typeof nativeGetContext;

      const glPrototype = WebGL2RenderingContext.prototype;
      const nativeTexImage2D = glPrototype.texImage2D;
      glPrototype.texImage2D = function (
        this: WebGL2RenderingContext,
        ...args: unknown[]
      ) {
        const width = args[3];
        const height = args[4];
        const pixels = args[8];
        if (
          failFirstRenderTargetResize &&
          !renderTargetResizeFailed &&
          referenceContexts.has(this) &&
          args.length >= 9 &&
          typeof width === "number" &&
          width > 1 &&
          typeof height === "number" &&
          height > 1 &&
          pixels === null
        ) {
          renderTargetResizeFailed = true;
          throw new Error("Reference WebGL probe render-target resize failure");
        }
        return Reflect.apply(nativeTexImage2D, this, args);
      } as typeof nativeTexImage2D;
      const nativeDrawArrays = glPrototype.drawArrays;
      glPrototype.drawArrays = function (mode, first, count) {
        if (referenceContexts.has(this)) metrics.drawCount += 1;
        return Reflect.apply(nativeDrawArrays, this, [mode, first, count]);
      };
      const nativeGetUniformLocation = glPrototype.getUniformLocation;
      glPrototype.getUniformLocation = function (program, name) {
        const location = Reflect.apply(nativeGetUniformLocation, this, [
          program,
          name,
        ]);
        if (referenceContexts.has(this) && location) {
          uniformNames.set(location, name);
        }
        return location;
      };
      const nativeUniform2f = glPrototype.uniform2f;
      glPrototype.uniform2f = function (location, x, y) {
        if (referenceContexts.has(this) && location) {
          const name = uniformNames.get(location);
          if (name) metrics.pointerUniforms.push({name, x, y});
        }
        return Reflect.apply(nativeUniform2f, this, [location, x, y]);
      };

      const nativeDeleteBuffer = glPrototype.deleteBuffer;
      glPrototype.deleteBuffer = function (buffer) {
        if (referenceContexts.has(this) && buffer) metrics.deletions.buffer += 1;
        return Reflect.apply(nativeDeleteBuffer, this, [buffer]);
      };
      const nativeDeleteFramebuffer = glPrototype.deleteFramebuffer;
      glPrototype.deleteFramebuffer = function (framebuffer) {
        if (referenceContexts.has(this) && framebuffer) {
          metrics.deletions.framebuffer += 1;
        }
        return Reflect.apply(nativeDeleteFramebuffer, this, [framebuffer]);
      };
      const nativeDeleteProgram = glPrototype.deleteProgram;
      glPrototype.deleteProgram = function (program) {
        if (referenceContexts.has(this) && program) metrics.deletions.program += 1;
        return Reflect.apply(nativeDeleteProgram, this, [program]);
      };
      const nativeDeleteShader = glPrototype.deleteShader;
      glPrototype.deleteShader = function (shader) {
        if (referenceContexts.has(this) && shader) metrics.deletions.shader += 1;
        return Reflect.apply(nativeDeleteShader, this, [shader]);
      };
      const nativeDeleteTexture = glPrototype.deleteTexture;
      glPrototype.deleteTexture = function (texture) {
        if (referenceContexts.has(this) && texture) metrics.deletions.texture += 1;
        return Reflect.apply(nativeDeleteTexture, this, [texture]);
      };
      const nativeDeleteVertexArray = glPrototype.deleteVertexArray;
      glPrototype.deleteVertexArray = function (vertexArray) {
        if (referenceContexts.has(this) && vertexArray) {
          metrics.deletions.vertexArray += 1;
        }
        return Reflect.apply(nativeDeleteVertexArray, this, [vertexArray]);
      };

      const NativeResizeObserver = window.ResizeObserver;
      class ReferenceProbeResizeObserver {
        private readonly inner: ResizeObserver;
        private referencesCanvas = false;

        constructor(callback: ResizeObserverCallback) {
          this.inner = new NativeResizeObserver(callback);
        }

        disconnect() {
          if (this.referencesCanvas) metrics.resizeDisconnects += 1;
          this.inner.disconnect();
        }

        observe(target: Element, options?: ResizeObserverOptions) {
          if (isReferenceCanvas(target)) this.referencesCanvas = true;
          this.inner.observe(target, options);
          if (isReferenceCanvas(target)) maskReferenceIntersectionObserver();
        }

        unobserve(target: Element) {
          this.inner.unobserve(target);
        }
      }
      window.ResizeObserver =
        ReferenceProbeResizeObserver as unknown as typeof ResizeObserver;

      if (intersectionMode === "controlled") {
        class ReferenceProbeIntersectionObserver {
          private readonly callback: IntersectionObserverCallback;
          private readonly controlled: boolean;
          private readonly inner: IntersectionObserver | null;
          private readonly targets = new Set<Element>();

          constructor(
            callback: IntersectionObserverCallback,
            options?: IntersectionObserverInit,
          ) {
            this.callback = callback;
            this.controlled = options?.rootMargin === "300px";
            this.inner = this.controlled
              ? null
              : new NativeIntersectionObserver(callback, options);
            if (this.controlled) controlledIntersections.add(this);
          }

          disconnect() {
            if (this.controlled) {
              metrics.intersectionDisconnects += 1;
              controlledIntersections.delete(this);
              this.targets.clear();
            } else {
              this.inner?.disconnect();
            }
          }

          emit(isIntersecting: boolean) {
            if (!this.controlled || this.targets.size === 0) return;
            const entries = [...this.targets].map((target) => {
              const rect = target.getBoundingClientRect();
              return {
                boundingClientRect: rect,
                intersectionRatio: isIntersecting ? 1 : 0,
                intersectionRect: isIntersecting ? rect : new DOMRectReadOnly(),
                isIntersecting,
                rootBounds: null,
                target,
                time: performance.now(),
              } as IntersectionObserverEntry;
            });
            this.callback(entries, this as unknown as IntersectionObserver);
          }

          observe(target: Element) {
            if (!this.controlled) {
              this.inner?.observe(target);
              return;
            }
            this.targets.add(target);
            queueMicrotask(() => this.emit(true));
          }

          takeRecords() {
            return this.inner?.takeRecords() ?? [];
          }

          unobserve(target: Element) {
            if (this.controlled) this.targets.delete(target);
            else this.inner?.unobserve(target);
          }
        }
        window.IntersectionObserver =
          ReferenceProbeIntersectionObserver as unknown as typeof IntersectionObserver;
      }

      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => metrics.visibility,
      });
      Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => metrics.visibility === "hidden",
      });

      const nativeSetTimeout = window.setTimeout;
      const nativeClearTimeout = window.clearTimeout;
      window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
        if (timeout === 150 && hasReferenceCanvas()) {
          const timer = nextHeldTimer;
          nextHeldTimer -= 1;
          heldTimers.set(timer, {args, handler});
          return timer;
        }
        return Reflect.apply(nativeSetTimeout, window, [handler, timeout, ...args]);
      }) as typeof window.setTimeout;
      window.clearTimeout = ((timer?: number) => {
        if (typeof timer === "number" && heldTimers.has(timer)) {
          heldTimers.delete(timer);
          metrics.clearedScrollTimers += 1;
          return;
        }
        Reflect.apply(nativeClearTimeout, window, [timer]);
      }) as typeof window.clearTimeout;

      (window as ProbeWindow).__referenceWebGLProbe = {
        emitIntersection(isIntersecting) {
          controlledIntersections.forEach((observer) =>
            observer.emit(isIntersecting),
          );
        },
        releaseScrollTimers() {
          const pending = [...heldTimers.values()];
          heldTimers.clear();
          pending.forEach(({args, handler}) => {
            if (typeof handler === "function") handler(...args);
          });
        },
        setVisibility(visibility) {
          metrics.visibility = visibility;
          document.dispatchEvent(new Event("visibilitychange"));
        },
        snapshot() {
          return {
            activeListeners: listeners.filter((listener) => listener.active).length,
            clearedScrollTimers: metrics.clearedScrollTimers,
            contextCalls: metrics.contextCalls,
            deletions: {...metrics.deletions},
            drawCount: metrics.drawCount,
            heldScrollTimers: heldTimers.size,
            intersectionDisconnects: metrics.intersectionDisconnects,
            pointerUniforms: metrics.pointerUniforms.slice(),
            removedListeners: metrics.removedListeners,
            resizeDisconnects: metrics.resizeDisconnects,
            visibility: metrics.visibility,
          };
        },
      };
    },
    {
      failFirstRenderTargetResize:
        options.failFirstRenderTargetResize ?? false,
      intersectionMode: options.intersectionMode ?? "native",
      webglMode: options.webglMode ?? "normal",
    },
  );
}

export async function readReferenceWebGLProbe(page: Page) {
  return page.evaluate(() => {
    const probe = (window as ProbeWindow).__referenceWebGLProbe;
    if (!probe) throw new Error("Reference WebGL probe was not installed");
    return probe.snapshot();
  });
}

export async function emitReferenceIntersection(
  page: Page,
  isIntersecting: boolean,
) {
  await page.evaluate((nextValue) => {
    const probe = (window as ProbeWindow).__referenceWebGLProbe;
    if (!probe) throw new Error("Reference WebGL probe was not installed");
    probe.emitIntersection(nextValue);
  }, isIntersecting);
}

export async function setReferenceVisibility(
  page: Page,
  visibility: "hidden" | "visible",
) {
  await page.evaluate((nextVisibility) => {
    const probe = (window as ProbeWindow).__referenceWebGLProbe;
    if (!probe) throw new Error("Reference WebGL probe was not installed");
    probe.setVisibility(nextVisibility);
  }, visibility);
}

export async function releaseReferenceScrollTimers(page: Page) {
  await page.evaluate(() => {
    const probe = (window as ProbeWindow).__referenceWebGLProbe;
    if (!probe) throw new Error("Reference WebGL probe was not installed");
    probe.releaseScrollTimers();
  });
}
