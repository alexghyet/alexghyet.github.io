import { useState } from "react";
import { leadership } from "../data/profile";
import { CountUp, Reveal, SectionHead } from "../components/motion";

// The cabinet as a graph: one hub, 18 nodes, a few lateral edges because
// good teams talk to each other and not just to the president.
const NODES = Array.from({ length: leadership.cabinet }, (_, i) => {
  const ring = i % 2 === 0 ? 112 : 78;
  const a = (i / leadership.cabinet) * Math.PI * 2 - Math.PI / 2;
  return { id: i, x: 150 + Math.cos(a) * ring, y: 150 + Math.sin(a) * ring };
});
const LATERAL = NODES.map((n, i) => [i, (i + 1) % NODES.length]).filter((_, i) => i % 3 !== 2);

export default function Leadership() {
  const [hover, setHover] = useState(null);
  const near = (i) => hover === i || LATERAL.some(([a, b]) => (a === hover && b === i) || (b === hover && a === i));

  return (
    <section id="leadership" className="section section--tight">
      <SectionHead
        index="04"
        kicker="leadership"
        title="Growing a community, not just a codebase"
      />

      <Reveal className="card leader">
        <div className="leader__text">
          <p className="card__label">{leadership.dates}</p>
          <h3 className="leader__role">
            {leadership.role}, <span>{leadership.org}</span>
          </h3>
          <p className="leader__school">{leadership.school}</p>
          <ul className="bullets">
            {leadership.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="leader__stat">
            <span className="stat__value">
              <CountUp value={leadership.cabinet} />
            </span>
            <span className="stat__label">executive cabinet members. Hover the graph to meet the network.</span>
          </div>
        </div>

        <svg className="graph" viewBox="0 0 300 300" role="img" aria-label="Network graph of the ACM executive cabinet">
          {NODES.map((n) => (
            <line
              key={`hub-${n.id}`}
              x1="150"
              y1="150"
              x2={n.x}
              y2={n.y}
              className={`graph__edge ${hover === n.id ? "is-hot" : ""}`}
            />
          ))}
          {LATERAL.map(([a, b]) => (
            <line
              key={`lat-${a}-${b}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              className={`graph__edge graph__edge--lateral ${hover === a || hover === b ? "is-hot" : ""}`}
            />
          ))}
          {NODES.map((n) => (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={hover === n.id ? 8 : 5.5}
              className={`graph__node ${near(n.id) ? "is-hot" : ""}`}
              style={{ "--i": n.id }}
              onPointerEnter={() => setHover(n.id)}
              onPointerLeave={() => setHover(null)}
            />
          ))}
          <circle cx="150" cy="150" r="24" className="graph__hub" />
          <text x="150" y="154" textAnchor="middle" className="graph__label">
            ACM
          </text>
        </svg>
      </Reveal>
    </section>
  );
}
