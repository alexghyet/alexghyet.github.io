import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { profile, sections } from "../data/profile";

export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 3 27 9.5v13L16 29 5 22.5v-13Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11 20.5 16 10l5 10.5M12.8 17h6.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="27" cy="9.5" r="2.6" className="logo__dot" />
    </svg>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  // Scroll progress as a thin line under the bar.
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      navRef.current?.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Highlight whichever section is crossing the middle of the screen.
  useEffect(() => {
    if (pathname !== "/") return;
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const current = pathname === "/" ? active : null;

  return (
    <header className={`nav ${open ? "is-open" : ""}`} ref={navRef}>
      <div className="nav__inner">
        <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
          <Logo />
          <span>
            alejandro<b>.lopez</b>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Sections">
          {sections.map((s) => (
            <Link
              key={s.id}
              to={{ pathname: "/", hash: `#${s.id}` }}
              className={current === s.id ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {s.label}
            </Link>
          ))}
        </nav>

        <a className="nav__cta" href={profile.resume} target="_blank" rel="noopener noreferrer">
          resume <span aria-hidden="true">↗</span>
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
      <span className="nav__progress" aria-hidden="true" />
    </header>
  );
}
