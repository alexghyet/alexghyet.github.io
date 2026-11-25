import { education, now } from "../data/profile";
import { Reveal, SectionHead } from "../components/motion";

export default function About() {
  return (
    <section id="about" className="section">
      <SectionHead
        index="01"
        kicker="about"
        title="Turning data into things people can explore"
      />

      <div className="about">
        <Reveal className="about__bio">
          <p>
            Hey, I'm Alejandro! I study Computer Science at Cal State LA, with a minor in
            Biomedical Engineering.
          </p>
          <p>
            Most of my work lives on the data side. I've reduced high-dimensional embeddings so
            researchers can actually see them, built interactive visualizations, and wired
            sensors and cameras into software. My favorite projects end with something people
            can explore and use.
          </p>
          <p>
            This site is where I keep my projects, research write-ups, and whatever I'm curious
            about right now. Poke around. Most of the tiles up top do something. :D
          </p>
        </Reveal>

        <Reveal className="about__side" delay={120}>
          <div className="card timeline">
            <p className="card__label">education</p>
            <ol className="timeline__list">
              {education.map((e) => (
                <li key={e.school}>
                  <span className="timeline__node" aria-hidden="true" />
                  <p className="timeline__date">{e.date}</p>
                  <p className="timeline__degree">{e.degree}</p>
                  <p className="timeline__school">{e.school}</p>
                  {e.detail && <p className="timeline__detail">{e.detail}</p>}
                </li>
              ))}
            </ol>
          </div>

          <div className="card">
            <p className="card__label">right now</p>
            <ul className="now-list">
              {now.map((n) => (
                <li key={n.org}>
                  <span className="now-list__role">{n.role}</span>
                  <span className="now-list__org">{n.org}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
