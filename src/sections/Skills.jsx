import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { skills, coursework, projects, research } from "../data/profile";
import { Reveal, SectionHead } from "../components/motion";

// Linked views, like PepSpace: pick a skill and see where it shows up.
const WORK = [
  { title: research.title, meta: "Research", tags: research.tags, to: "/#research" },
  ...projects.map((p) => ({ title: p.title, meta: p.date, tags: p.tags, to: `/#project-${p.id}` })),
];

const usedIn = (skill) =>
  WORK.filter((w) => w.tags.some((t) => t.toLowerCase() === skill.toLowerCase()));

export default function Skills() {
  const [active, setActive] = useState("Python");
  const matches = useMemo(() => usedIn(active), [active]);

  return (
    <section id="skills" className="section">
      <SectionHead
        index="05"
        kicker="skills"
        title="Tools I reach for"
      >
        Hover or tap a skill to see where I've used it on this page.
      </SectionHead>

      <div className="skills">
        <Reveal className="skills__groups">
          {skills.map((group) => (
            <div className="card skill-group" key={group.lane}>
              <p className="card__label">{group.lane}</p>
              <ul className="skill-group__chips">
                {group.items.map((item) => {
                  const count = usedIn(item).length;
                  return (
                    <li key={item}>
                      <button
                        type="button"
                        className={`skill ${item === active ? "is-active" : ""} ${count ? "has-work" : ""}`}
                        aria-pressed={item === active}
                        onPointerEnter={() => setActive(item)}
                        onFocus={() => setActive(item)}
                        onClick={() => setActive(item)}
                      >
                        {item}
                        {count > 0 && <span className="skill__count">{count}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </Reveal>

        <Reveal className="card used" delay={120}>
          <p className="card__label">used in</p>
          <p className="used__skill">{active}</p>
          {matches.length ? (
            <ul className="used__list" key={active}>
              {matches.map((m, i) => (
                <li key={m.title} style={{ "--i": i }}>
                  <Link to={m.to}>
                    <span className="used__title">{m.title}</span>
                    <span className="used__meta">{m.meta}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="used__empty">
              Part of my toolkit, but not featured in a project on this page yet.
            </p>
          )}
        </Reveal>
      </div>

      <Reveal className="coursework" delay={100}>
        <p className="card__label">relevant coursework</p>
        <ul className="tags tags--soft">
          {coursework.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
