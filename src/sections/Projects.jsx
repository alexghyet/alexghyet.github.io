import { projects } from "../data/profile";
import { Reveal, SectionHead } from "../components/motion";
import { RhythmVisual, LensVisual, SonarVisual, SiteVisual } from "./ProjectVisuals";

const VISUALS = {
  rhythm: RhythmVisual,
  lens: LensVisual,
  sonar: SonarVisual,
  site: SiteVisual,
};

function tilt(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
}

function untilt(e) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <SectionHead
        index="03"
        kicker="projects"
        title="Things I've built and am building"
      >
        Hardware that talks to games, games that teach, and robots that need to see.
      </SectionHead>

      <div className="projects">
        {projects.map((p, i) => {
          const Visual = VISUALS[p.visual];
          return (
            <Reveal
              key={p.id}
              id={`project-${p.id}`}
              className={`projects__cell projects__cell--${p.id}`}
              delay={i * 80}
            >
              <article className="card project" onPointerMove={tilt} onPointerLeave={untilt}>
                <div className="project__visual theme-dark">
                  <Visual />
                  <span className="project__hint">{p.hint}</span>
                </div>
                <div className="project__body">
                  <p className="project__meta">
                    <span>{p.role}</span>
                    <span>{p.date}</span>
                  </p>
                  <h3 className="project__title">{p.title}</h3>
                  <p className="project__blurb">{p.blurb}</p>
                  {p.bullets.length > 0 && (
                    <ul className="bullets bullets--compact">
                      {p.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                  <ul className="tags">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  {p.links?.length > 0 && (
                    <div className="actions">
                      {p.links.map((l) => (
                        <a key={l.href} className="btn btn--small" href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label} <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
