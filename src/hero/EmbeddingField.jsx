import { useEffect, useRef, useState } from "react";
import {
  runCanvas,
  localPoint,
  mulberry32,
  gaussian,
  clamp,
  prefersReducedMotion,
} from "../lib/canvas";
import { PALETTE } from "../lib/palette";

// A toy version of PepSpace: peptides as points in a 2D projection.
// Hover to probe nearest neighbors, click anywhere to "re-run UMAP".
const CLASSES = [
  { label: "AMP", color: PALETTE.green },
  { label: "non-AMP", color: PALETTE.pink },
  { label: "unlabeled", color: PALETTE.blue },
];
const K = 8;
const ALL_AA = "ACDEFGHIKLMNPQRSTVWY";
const BIAS = ["KKRRLLLWIVAG", "DEEDSTNQPGYM", ""];

function makePeptide(rng, cls) {
  const pool = BIAS[cls] + ALL_AA;
  const len = 10 + Math.floor(rng() * 11);
  let seq = "";
  for (let i = 0; i < len; i++) seq += pool[Math.floor(rng() * pool.length)];
  return seq;
}

// Generate cluster shapes in normalized [0,1] space, keeping the middle of
// the tile calmer so the name stays readable.
function makeClusters(rng, aspect) {
  const count = 7 + Math.floor(rng() * 3);
  const clusters = [];
  for (let i = 0; i < count; i++) {
    let x = 0.5;
    let y = 0.5;
    for (let tries = 0; tries < 30; tries++) {
      x = 0.08 + rng() * 0.84;
      y = 0.12 + rng() * 0.76;
      const inName = ((x - 0.5) / 0.34) ** 2 + ((y - 0.5) / 0.27) ** 2 < 1;
      if (!inName) break;
    }
    const kind = rng() < 0.3 ? "arc" : rng() < 0.15 ? "strand" : "blob";
    clusters.push({
      x,
      y,
      kind,
      dominant: i % 2,
      spread: 0.05 + rng() * 0.045,
      stretch: 0.6 + rng() * 0.8,
      angle: rng() * Math.PI,
      arcStart: rng() * Math.PI * 2,
      arcSpan: 1.2 + rng() * 1.8,
      aspect,
    });
  }
  return clusters;
}

function samplePoint(rng, c) {
  let dx;
  let dy;
  if (c.kind === "arc") {
    const a = c.arcStart + rng() * c.arcSpan;
    const r = c.spread * 2.2 + gaussian(rng) * 0.012;
    dx = Math.cos(a) * r;
    dy = Math.sin(a) * r;
  } else if (c.kind === "strand") {
    const along = (rng() - 0.5) * c.spread * 5;
    const across = gaussian(rng) * 0.022;
    dx = Math.cos(c.angle) * along - Math.sin(c.angle) * across;
    dy = Math.sin(c.angle) * along + Math.cos(c.angle) * across;
  } else {
    const gx = gaussian(rng) * c.spread;
    const gy = gaussian(rng) * c.spread * c.stretch;
    dx = Math.cos(c.angle) * gx - Math.sin(c.angle) * gy;
    dy = Math.sin(c.angle) * gx + Math.cos(c.angle) * gy;
  }
  return { x: c.x + dx / c.aspect, y: c.y + dy };
}

// Mirror a coordinate back inside [lo, hi] so off-canvas points keep the
// cluster's shape instead of piling up on the edge.
const reflect = (v, lo, hi) =>
  v < lo ? Math.min(hi, 2 * lo - v) : v > hi ? Math.max(lo, 2 * hi - v) : v;

function sampleInside(rng, c) {
  const p = samplePoint(rng, c);
  return { x: reflect(p.x, 0.03, 0.97), y: reflect(p.y, 0.07, 0.93) };
}

function hexAlpha(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export default function EmbeddingField({ children }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const tipRef = useRef(null);
  const reprojectRef = useRef(() => {});
  const [seed, setSeed] = useState(1280);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const reduced = prefersReducedMotion();
    const rng = mulberry32(3556);
    const pointer = { x: 0, y: 0, active: false };
    let W = 0;
    let H = 0;
    let clock = 0;
    let points = [];
    let ripple = null;

    function assignTargets(seedValue, originX, originY) {
      const r = mulberry32(seedValue);
      const clusters = makeClusters(r, W / Math.max(H, 1));
      const byClass = [0, 1].map((cls) => clusters.filter((c) => c.dominant === cls));
      for (const p of points) {
        // Labeled peptides mostly land with their own kind. Unlabeled ones
        // scatter everywhere, which is the whole point of PU learning.
        const own = p.cls < 2 && r() < 0.82 ? byClass[p.cls] : clusters;
        const c = own[Math.floor(r() * own.length)];
        const t = sampleInside(r, c);
        p.tx = t.x;
        p.ty = t.y;
        const dist = Math.hypot(p.x - originX, p.y - originY);
        p.wait = reduced ? 0 : dist / 900 + r() * 0.15;
      }
    }

    function init() {
      const n = clamp(Math.round((W * H) / 1000), 180, 520);
      points = Array.from({ length: n }, () => {
        const roll = rng();
        const cls = roll < 0.36 ? 0 : roll < 0.7 ? 1 : 2;
        return {
          cls,
          seq: makePeptide(rng, cls),
          x: W / 2 + gaussian(rng) * 6,
          y: H / 2 + gaussian(rng) * 6,
          vx: 0,
          vy: 0,
          k: 7 + rng() * 8,
          r: 1.3 + rng() * 1.3,
          phase: rng() * Math.PI * 2,
          tx: 0.5,
          ty: 0.5,
          wait: 0,
        };
      });
      assignTargets(1280, W / 2, H / 2);
      for (const p of points) p.wait += reduced ? 0 : 0.25;
    }

    function reproject(x, y) {
      const next = 1000 + Math.floor(Math.random() * 9000);
      setSeed(next);
      assignTargets(next, x, y);
      ripple = { x, y, t0: clock };
    }

    function nearest() {
      const best = [];
      for (const p of points) {
        const d = (p.x - pointer.x) ** 2 + (p.y - pointer.y) ** 2;
        if (best.length < K || d < best[best.length - 1].d) {
          best.push({ p, d });
          best.sort((a, b) => a.d - b.d);
          if (best.length > K) best.pop();
        }
      }
      return best;
    }

    function drawAxes(ctx) {
      const x0 = 18;
      const y0 = H - 18;
      ctx.strokeStyle = hexAlpha(PALETTE.muted, 0.35);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, y0 - 34);
      ctx.lineTo(x0, y0);
      ctx.lineTo(x0 + 34, y0);
      ctx.stroke();
      ctx.fillStyle = hexAlpha(PALETTE.muted, 0.6);
      ctx.font = "500 9px 'JetBrains Mono', monospace";
      ctx.fillText("UMAP-1", x0 + 40, y0 + 3);
      ctx.save();
      ctx.translate(x0 + 3, y0 - 40);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("UMAP-2", 0, 0);
      ctx.restore();
    }

    // The tooltip is a DOM node so it can sit above the name overlay.
    const tip = tipRef.current;
    const tipSeq = tip.firstElementChild;
    const tipMeta = tip.lastElementChild;
    let tipKey = null;
    let tipW = 0;
    let tipH = 0;

    function updateTip(knn) {
      if (!pointer.active || !knn.length) {
        if (tipKey !== null) tip.classList.remove("is-on");
        tipKey = null;
        return;
      }
      const p = knn[0].p;
      const agree = knn.filter((n) => n.p.cls === p.cls).length;
      const key = p.seq + agree;
      if (key !== tipKey) {
        tipKey = key;
        const color = CLASSES[p.cls].color;
        tipSeq.textContent = p.seq;
        tipSeq.style.color = color;
        tipMeta.textContent = `${CLASSES[p.cls].label} · ${agree}/${K} neighbors agree`;
        tip.style.borderColor = hexAlpha(color, 0.55);
        tip.classList.add("is-on");
        tipW = tip.offsetWidth;
        tipH = tip.offsetHeight;
      }
      let bx = pointer.x + 16;
      let by = pointer.y + 16;
      if (bx + tipW > W - 8) bx = pointer.x - tipW - 16;
      if (by + tipH > H - 8) by = pointer.y - tipH - 16;
      tip.style.transform = `translate(${bx}px, ${by}px)`;
    }

    const stop = runCanvas(canvas, {
      resize(w, h) {
        W = w;
        H = h;
        if (!points.length) init();
      },
      frame(ctx, w, h, dt) {
        clock += dt;
        ctx.clearRect(0, 0, w, h);

        for (const p of points) {
          if (p.wait > 0) {
            p.wait -= dt;
            continue;
          }
          const drift = reduced ? 0 : 1.6;
          const tx = p.tx * w + Math.sin(clock * 0.5 + p.phase) * drift;
          const ty = p.ty * h + Math.cos(clock * 0.43 + p.phase * 1.3) * drift;
          p.vx += (tx - p.x) * p.k * dt;
          p.vy += (ty - p.y) * p.k * dt;
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const d = Math.hypot(dx, dy) || 1;
            if (d < 60) {
              const f = (1 - d / 60) ** 2 * 1400 * dt;
              p.vx += (dx / d) * f;
              p.vy += (dy / d) * f;
            }
          }
          const damp = Math.exp(-6 * dt);
          p.vx *= damp;
          p.vy *= damp;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }

        drawAxes(ctx);

        const knn = pointer.active ? nearest() : [];
        knn.forEach(({ p }, i) => {
          ctx.strokeStyle = hexAlpha(CLASSES[p.cls].color, 0.6 * (1 - i / K) + 0.1);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        });

        ctx.globalCompositeOperation = "lighter";
        for (const p of points) {
          const c = CLASSES[p.cls].color;
          ctx.fillStyle = hexAlpha(c, p.cls === 2 ? 0.06 : 0.09);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = hexAlpha(c, p.cls === 2 ? 0.55 : 0.9);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";

        for (const { p } of knn) {
          ctx.strokeStyle = CLASSES[p.cls].color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (pointer.active) {
          ctx.strokeStyle = hexAlpha(PALETTE.text, 0.5);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2);
          ctx.stroke();
        }
        updateTip(knn);

        if (ripple) {
          const age = clock - ripple.t0;
          const radius = age * 900;
          const alpha = Math.max(0, 0.5 - age * 0.45);
          if (alpha <= 0) ripple = null;
          else {
            ctx.strokeStyle = hexAlpha(PALETTE.green, alpha);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      },
    });

    const onMove = (e) => {
      const pt = localPoint(e, canvas);
      pointer.x = pt.x;
      pointer.y = pt.y;
      pointer.active = true;
      root.style.setProperty("--px", ((pt.x / W) * 2 - 1).toFixed(3));
      root.style.setProperty("--py", ((pt.y / H) * 2 - 1).toFixed(3));
    };
    const onLeave = () => {
      pointer.active = false;
      root.style.setProperty("--px", "0");
      root.style.setProperty("--py", "0");
    };
    const onClick = (e) => {
      if (e.target.closest("button, a")) return;
      const pt = localPoint(e, canvas);
      reproject(pt.x, pt.y);
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("click", onClick);
    reprojectRef.current = () => reproject(W / 2, H / 2);

    return () => {
      stop();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="embed" ref={rootRef}>
      <canvas
        ref={canvasRef}
        className="embed__canvas"
        role="img"
        aria-label="Animated scatter plot of peptide embeddings. Hover to see nearest neighbors, click to re-project."
      />
      {children}
      <div className="embed__tip" ref={tipRef} aria-hidden="true">
        <b />
        <span />
      </div>
      <div className="embed__legend" aria-hidden="true">
        {CLASSES.map((c) => (
          <span key={c.label}>
            <i style={{ background: c.color }} />
            {c.label}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="embed__reproject"
        onClick={() => reprojectRef.current()}
      >
        <span className="embed__seed">seed={seed}</span>
        <span>re-project ↻</span>
      </button>
    </div>
  );
}
