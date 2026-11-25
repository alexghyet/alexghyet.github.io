import { useState } from "react";
import { Link } from "react-router-dom";
import { research, publication } from "../data/profile";
import { CountUp, Reveal, SectionHead } from "../components/motion";
import { Icon } from "../components/Icon";

export default function Research() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(publication.apa);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be blocked; the citation is still visible to select */
    }
  };

  return (
    <section id="research" className="section">
      <SectionHead
        index="02"
        kicker="research"
        title="Mapping peptides in embedding space"
      >
        Dimensionality reduction for antimicrobial peptide data. I build tools that make
        1,280-dimensional embeddings something researchers can actually look at.
      </SectionHead>

      <div className="research">
        <Reveal className="card research__main">
          <div className="research__top">
            <div>
              <p className="card__label">{research.role}</p>
              <h3 className="research__title">{research.title}</h3>
              <p className="research__meta">
                {research.org} · {research.dates}
              </p>
            </div>
            <span className="pill pill--green">active</span>
          </div>
          <p className="research__summary">{research.summary}</p>
          <ul className="bullets">
            {research.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <ul className="tags">
            {research.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="actions">
            <Link className="btn btn--primary" to={research.writeup}>
              Read the write-up <span aria-hidden="true">→</span>
            </Link>
            <a className="btn" href={research.poster} target="_blank" rel="noopener noreferrer">
              GMiS 2026 poster (PDF) <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>

        <div className="research__side">
          <Reveal className="stats" delay={100}>
            {research.stats.map((s) => (
              <div className="stat" key={s.label}>
                <p className="stat__value">
                  <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} />
                </p>
                <p className="stat__label">{s.label}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="card paper" delay={200}>
            <p className="card__label">
              publication · <span className="pill pill--green">{publication.status}</span>
            </p>
            <p className="paper__title">{publication.title}</p>
            <p className="paper__authors">
              {publication.authors.map((a, i) => (
                <span key={a}>
                  {a === publication.me ? <b>{a}</b> : a}
                  {i < publication.authors.length - 1 ? ", " : ""}
                </span>
              ))}{" "}
              ({publication.year})
            </p>
            <p className="paper__venue">{publication.venue}</p>
            <button type="button" className="btn btn--small" onClick={copy}>
              <Icon name="copy" size={14} />
              {copied ? "Copied APA citation" : "Copy APA citation"}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
