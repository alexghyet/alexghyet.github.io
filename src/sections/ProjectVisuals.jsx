import { useRef, useState } from "react";

const relative = (e, el) => {
  const r = el.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
};

/* Rehab Rhapsody: an equalizer that follows your "arm". Click plays a note. */
const BARS = 32;
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

export function RhythmVisual() {
  const ref = useRef(null);
  const audio = useRef(null);
  const [notes, setNotes] = useState([]);

  const onMove = (e) => {
    const { x, w } = relative(e, ref.current);
    const u = x / w;
    ref.current.classList.add("is-live");
    [...ref.current.querySelectorAll(".eq__bar")].forEach((bar, i) => {
      const d = i / (BARS - 1) - u;
      bar.style.setProperty("--h", (0.12 + 0.88 * Math.exp(-(d * d) / 0.012)).toFixed(3));
    });
  };
  const onLeave = () => ref.current.classList.remove("is-live");

  const play = (e) => {
    const { x, y, w } = relative(e, ref.current);
    const u = Math.min(0.999, Math.max(0, x / w));
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!audio.current) audio.current = new Ctx();
      const ctx = audio.current;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = SCALE[Math.floor(u * SCALE.length)];
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1);
    } catch {
      /* audio is a bonus */
    }
    const id = performance.now();
    setNotes((n) => [...n.slice(-6), { id, x, y, glyph: ["♪", "♫", "♩"][Math.floor(Math.random() * 3)] }]);
    setTimeout(() => setNotes((n) => n.filter((note) => note.id !== id)), 1200);
  };

  return (
    <div className="eq" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} onClick={play}>
      <div className="eq__bars">
        {Array.from({ length: BARS }, (_, i) => (
          <span key={i} className="eq__bar" style={{ "--i": i, "--r": ((i * 7) % 11) / 10 }} />
        ))}
      </div>
      <span className="eq__hitline" aria-hidden="true" />
      {notes.map((n) => (
        <span key={n.id} className="eq__note" style={{ left: n.x, top: n.y }} aria-hidden="true">
          {n.glyph}
        </span>
      ))}
    </div>
  );
}

/* STEMtective: a magnifying lens that reveals hidden clues. */
const SYMBOLS = ["∫", "Σ", "π", "ΔG", "pH", "λ", "∂", "∞", "√", "Ω", "μ", "θ", "F=ma", "E=mc²", "H₂O", "x̄", "∇", "α", "β", "CO₂"];
const CLUES = [
  { text: "case #042", x: 20, y: 34 },
  { text: "motive: ∂y/∂x", x: 62, y: 26 },
  { text: "suspect: x=3", x: 32, y: 72 },
  { text: "alibi: pH 7.4", x: 74, y: 70 },
];
const SCATTER = Array.from({ length: 34 }, (_, i) => ({
  s: SYMBOLS[(i * 7) % SYMBOLS.length],
  x: (i * 37) % 100,
  y: (i * 53 + 11) % 100,
}));

export function LensVisual() {
  const ref = useRef(null);
  const onMove = (e) => {
    const { x, y } = relative(e, ref.current);
    ref.current.classList.add("is-live");
    ref.current.style.setProperty("--lx", `${x}px`);
    ref.current.style.setProperty("--ly", `${y}px`);
  };
  const onLeave = () => ref.current.classList.remove("is-live");

  return (
    <div className="lens" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="lens__layer lens__layer--dim" aria-hidden="true">
        {SCATTER.map((d, i) => (
          <span key={i} style={{ left: `${d.x}%`, top: `${d.y}%` }}>
            {d.s}
          </span>
        ))}
      </div>
      <div className="lens__layer lens__layer--clue" aria-hidden="true">
        {SCATTER.map((d, i) => (
          <span key={i} style={{ left: `${d.x}%`, top: `${d.y}%` }}>
            {d.s}
          </span>
        ))}
        {CLUES.map((c) => (
          <b key={c.text} style={{ left: `${c.x}%`, top: `${c.y}%` }}>
            {c.text}
          </b>
        ))}
      </div>
      <span className="lens__glass" aria-hidden="true" />
    </div>
  );
}

/* RoboSub: a detector HUD where a bounding box locks onto your cursor. */
export function SonarVisual() {
  const ref = useRef(null);
  const [conf, setConf] = useState("0.93");

  const onMove = (e) => {
    const { x, y } = relative(e, ref.current);
    ref.current.classList.add("is-live");
    ref.current.style.setProperty("--tx", `${x}px`);
    ref.current.style.setProperty("--ty", `${y}px`);
    if (Math.random() < 0.08) setConf((0.86 + Math.random() * 0.12).toFixed(2));
  };
  const onLeave = () => ref.current.classList.remove("is-live");

  return (
    <div className="sonar" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <span className="sonar__caustics" aria-hidden="true" />
      <span className="sonar__sweep" aria-hidden="true" />
      <span className="bbox bbox--gate" aria-hidden="true">
        <em>gate 0.91</em>
      </span>
      <span className="bbox bbox--buoy" aria-hidden="true">
        <em>buoy 0.84</em>
      </span>
      <span className="bbox bbox--track" aria-hidden="true">
        <em>target {conf}</em>
      </span>
      <span className="sonar__hud" aria-hidden="true">
        jetson nano · cam0 · 30 fps
      </span>
    </div>
  );
}

/* This website: a tiny map of the hero grid with a "you are here" pin. */
export function SiteVisual() {
  return (
    <div className="minimap" aria-hidden="true">
      <div className="minimap__grid">
        {["about", "core", "research", "projects", "skills", "lead", "blog", "resume", "contact"].map((a) => (
          <span key={a} style={{ gridArea: a }} className={a === "core" ? "is-here" : ""}>
            {a === "core" && <i>you are here</i>}
          </span>
        ))}
      </div>
    </div>
  );
}
