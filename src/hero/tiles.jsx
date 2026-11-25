import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import headshot from "../assets/headshot.jpg";
import { profile, research, publication, projects, skills, leadership } from "../data/profile";
import { posts } from "../posts";
import { CountUp } from "../components/motion";
import { Icon } from "../components/Icon";
import { prefersReducedMotion } from "../lib/canvas";

export function AboutTile() {
  return (
    <div className="t-about">
      <div className="t-about__photo">
        <img src={headshot} alt={`Portrait of ${profile.name}`} width="800" height="800" />
      </div>
      <div className="t-about__intro">
        <p className="t-about__hi">Hey, I'm {profile.firstName}.</p>
        <p className="t-about__meta">
          <span className="pulse" aria-hidden="true" />
          {profile.location} · {profile.gradYear}
        </p>
      </div>
      <p className="t-about__blurb">{profile.aboutShort}</p>
    </div>
  );
}

export function ResearchTile() {
  return (
    <div className="t-research">
      <p className="t-research__badge">
        <span className="pill pill--green">accepted</span>
        {publication.venueShort}
      </p>
      <h2 className="t-research__title">{research.title}</h2>
      <p className="t-research__pitch">{research.pitch}</p>
      <div className="t-stats">
        {research.stats.map((s) => (
          <p key={s.label}>
            <b>
              <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} />
            </b>
            <span>{s.short}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function ProjectsTile() {
  return (
    <ol className="t-projects">
      {projects.map((p, i) => (
        <li key={p.id}>
          <Link to={`/#project-${p.id}`}>
            <span className="t-projects__n">{String(i + 1).padStart(2, "0")}</span>
            <span className="t-projects__title">{p.title}</span>
            <span className="t-projects__meta">{p.short}</span>
            <span className="t-projects__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

const CYCLE_MS = 3500;

// Cycles through skill categories on its own until someone interacts.
export function SkillsTile() {
  const [tab, setTab] = useState(0);
  const [auto, setAuto] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setTab((t) => (t + 1) % skills.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [auto]);

  const pick = (i) => {
    setTab(i);
    setAuto(false);
  };

  return (
    <div className="t-skills" onPointerEnter={() => setAuto(false)}>
      <div className="t-skills__tabs" role="tablist" aria-label="Skill categories">
        {skills.map((s, i) => (
          <button
            key={s.lane}
            type="button"
            role="tab"
            aria-selected={i === tab}
            onClick={() => pick(i)}
          >
            {s.lane}
          </button>
        ))}
      </div>
      <ul className="t-skills__chips" key={tab} role="tabpanel">
        {skills[tab].items.map((item, i) => (
          <li key={item} style={{ "--i": i }}>
            {item}
          </li>
        ))}
      </ul>
      <span className={`t-skills__timer ${auto ? "is-on" : ""}`} aria-hidden="true">
        <i key={tab} style={{ animationDuration: `${CYCLE_MS}ms` }} />
      </span>
    </div>
  );
}

export function LeadershipTile() {
  return (
    <div className="t-lead">
      <p className="t-lead__role">ACM {leadership.role}</p>
      <p className="t-lead__org">
        {leadership.school} · since {leadership.dates.split(" – ")[0]}
      </p>
      <div className="t-lead__foot">
        <p className="t-lead__stat">
          <b>
            <CountUp value={leadership.cabinet} />
          </b>
          <span>member cabinet</span>
        </p>
        <span className="t-lead__dots" aria-hidden="true">
          {Array.from({ length: leadership.cabinet }, (_, i) => (
            <i key={i} style={{ "--i": i }} />
          ))}
        </span>
      </div>
    </div>
  );
}

export function BlogTile() {
  const published = posts.filter((p) => !p.date.toLowerCase().includes("coming soon"));
  const latest = published[0] ?? posts[0];
  return (
    <div className="t-blog">
      <p className="t-blog__date">latest · {latest.date}</p>
      <Link className="t-blog__title" to={`/blog/${latest.slug}`}>
        {latest.title}
      </Link>
      <p className="t-blog__desc">{latest.description}</p>
    </div>
  );
}

export function ResumeTile() {
  return (
    <div className="t-resume">
      <span className="t-resume__paper" aria-hidden="true">
        {Array.from({ length: 11 }, (_, i) => (
          <i key={i} />
        ))}
      </span>
      <div className="t-resume__text">
        <p>Education, research, projects, leadership and skills on one page.</p>
        <div className="t-resume__actions">
          <a className="btn btn--primary btn--small" href={profile.resume} target="_blank" rel="noopener noreferrer">
            View <span aria-hidden="true">↗</span>
          </a>
          <a className="btn btn--small" href={profile.resume} download="Alejandro_Lopez_Resume.pdf">
            <Icon name="download" size={14} /> PDF
          </a>
        </div>
      </div>
    </div>
  );
}

function laTime() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Links that lean toward the cursor a little.
function magnetic(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left - r.width / 2) * 0.12;
  const y = (e.clientY - r.top - r.height / 2) * 0.25;
  el.style.transform = `translate(${x}px, ${y}px)`;
}
const release = (e) => (e.currentTarget.style.transform = "");

const CONTACT_LINKS = [
  { label: "Email", detail: profile.email, href: `mailto:${profile.email}`, icon: "mail" },
  { label: "GitHub", detail: "alexghyet", href: profile.github, icon: "github" },
  { label: "LinkedIn", detail: "alejandro-lopez-csula", href: profile.linkedin, icon: "linkedin" },
];

export function ContactTile() {
  const [time, setTime] = useState(laTime);

  useEffect(() => {
    const id = setInterval(() => setTime(laTime()), 20000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="t-contact">
      <p className="t-contact__status">
        <span className="pulse" aria-hidden="true" />
        {profile.location} · {time}
      </p>
      <ul className="t-contact__links">
        {CONTACT_LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              onPointerMove={magnetic}
              onPointerLeave={release}
            >
              <Icon name={l.icon} size={16} />
              <span>{l.label}</span>
              <span className="t-contact__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
