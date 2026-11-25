import { useRef } from "react";
import { Link } from "react-router-dom";
import { profile } from "../data/profile";
import EmbeddingField from "./EmbeddingField";
import {
  AboutTile,
  ResearchTile,
  ProjectsTile,
  SkillsTile,
  LeadershipTile,
  BlogTile,
  ResumeTile,
  ContactTile,
} from "./tiles";

// Every tile is a doorway to one section of the page. `stretch` makes the
// whole tile clickable when it has no other controls inside it.
function Tile({ area, order, index, label, to, more = "open", hint, stretch = false, overlay = false, children }) {
  const classes = ["tile", `tile--${area}`, overlay && "tile--overlay", stretch && "tile--stretch"];
  return (
    <section
      className={classes.filter(Boolean).join(" ")}
      style={{ gridArea: area, "--d": order }}
      aria-label={label}
    >
      <header className="tile__head">
        {index && <span className="tile__index">{index}</span>}
        <span className="tile__label">{label}</span>
        {hint && <span className="tile__hint">{hint}</span>}
        {to && (
          <Link to={to} className="tile__more" aria-label={`${more}: ${label}`}>
            {more} <span aria-hidden="true">→</span>
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

function Letters({ word, offset = 0 }) {
  return [...word].map((ch, i) => (
    <span key={i} className="ltr" style={{ "--i": i + offset }} aria-hidden="true">
      {ch}
    </span>
  ));
}

export default function BentoHero() {
  const gridRef = useRef(null);
  const frame = useRef(0);

  // Spotlight: every tile's border lights up relative to the cursor.
  const onPointerMove = (e) => {
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      for (const tile of gridRef.current?.querySelectorAll(".tile") ?? []) {
        const r = tile.getBoundingClientRect();
        tile.style.setProperty("--mx", `${clientX - r.left}px`);
        tile.style.setProperty("--my", `${clientY - r.top}px`);
      }
    });
  };

  return (
    <div className="hero" id="top">
      <div className="bento" ref={gridRef} onPointerMove={onPointerMove}>
        <Tile area="core" order={0} label="pepspace · live demo" hint="hover · click" overlay>
          <EmbeddingField>
            <div className="core">
              <p className="core__kicker">{profile.kicker}</p>
              <h1 className="core__name" aria-label={profile.name}>
                <span className="core__line">
                  <Letters word={profile.firstName} />
                </span>
                <span className="core__line">
                  <Letters word={profile.lastName} offset={profile.firstName.length} />
                </span>
              </h1>
              <p className="core__tagline">{profile.tagline}</p>
            </div>
          </EmbeddingField>
        </Tile>

        <Tile area="about" order={1} index="01" label="about" to="/#about" stretch>
          <AboutTile />
        </Tile>

        <Tile area="research" order={2} index="02" label="research" to="/#research" stretch>
          <ResearchTile />
        </Tile>

        <Tile area="projects" order={3} index="03" label="projects" to="/#projects" more="all">
          <ProjectsTile />
        </Tile>

        <Tile area="skills" order={4} index="05" label="skills" to="/#skills">
          <SkillsTile />
        </Tile>

        <Tile area="lead" order={5} index="04" label="leadership" to="/#leadership" stretch>
          <LeadershipTile />
        </Tile>

        <Tile area="blog" order={6} index="06" label="blog" to="/#blog" more="all posts">
          <BlogTile />
        </Tile>

        <Tile area="resume" order={7} label="resume">
          <ResumeTile />
        </Tile>

        <Tile area="contact" order={8} index="07" label="contact" to="/#contact">
          <ContactTile />
        </Tile>
      </div>

      <a className="hero__scroll" href="#about">
        <span>scroll for the full story</span>
        <i aria-hidden="true" />
      </a>
    </div>
  );
}
