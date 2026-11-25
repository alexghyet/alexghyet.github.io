import { useState } from "react";
import { profile } from "../data/profile";
import { Icon } from "../components/Icon";
import { Reveal } from "../components/motion";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <>
      <section id="contact" className="section contact">
        <Reveal className="contact__inner">
          <p className="section-head__kicker">
            <span>07</span>contact
          </p>
          <h2 className="contact__title">
            Feel free to reach out to me
          </h2>
          <p className="contact__lede">
            Research collaborations, internships, hackathon teams, or just a good conversation
            about data and code. My inbox is open.
          </p>
          <div className="contact__actions">
            <a className="btn btn--primary btn--large" href={`mailto:${profile.email}`}>
              <Icon name="mail" /> {profile.email}
            </a>
            <button type="button" className="btn btn--large" onClick={copyEmail}>
              <Icon name="copy" /> {copied ? "Copied!" : "Copy email"}
            </button>
          </div>
          <div className="contact__links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              <Icon name="github" /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <Icon name="linkedin" /> LinkedIn
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer">
              <Icon name="file" /> Resume
            </a>
          </div>
        </Reveal>
      </section>

      <footer className="footer">
        <p className="footer__meta">
          © {new Date().getFullYear()} {profile.name} · built with React and Vite
        </p>
      </footer>
    </>
  );
}
