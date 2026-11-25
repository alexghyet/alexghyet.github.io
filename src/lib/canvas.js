export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Sizes a canvas to its CSS box at device pixel ratio and runs `frame` on
 * requestAnimationFrame, but only while the canvas is on screen and the tab
 * is visible. Returns a cleanup function.
 */
export function runCanvas(canvas, { resize, frame }) {
  const ctx = canvas.getContext("2d");
  const size = { w: 0, h: 0 };
  let raf = 0;
  let running = false;
  let visible = true;
  let last = 0;

  const draw = (dt, t) => frame(ctx, size.w, size.h, dt, t);

  const measure = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pxW = Math.max(1, Math.round(rect.width * dpr));
    const pxH = Math.max(1, Math.round(rect.height * dpr));
    if (pxW === canvas.width && pxH === canvas.height && size.w) return;
    size.w = rect.width;
    size.h = rect.height;
    canvas.width = pxW;
    canvas.height = pxH;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    resize?.(size.w, size.h);
    if (!running) draw(0, performance.now() / 1000);
  };

  const loop = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    draw(dt, now / 1000);
    raf = requestAnimationFrame(loop);
  };

  const sync = () => {
    const should = visible && !document.hidden;
    if (should && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    } else if (!should && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  };

  const ro = new ResizeObserver(measure);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  io.observe(canvas);
  document.addEventListener("visibilitychange", sync);
  measure();
  sync();

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", sync);
  };
}

export function localPoint(event, el) {
  const rect = el.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

// Small seeded PRNG so layouts are reproducible per seed.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussian(rng) {
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
