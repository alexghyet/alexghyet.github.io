import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/canvas";
import { useInView } from "../lib/useInView";

export function Reveal({ as = "div", delay = 0, className = "", children, ...rest }) {
  const Tag = as;
  const [ref, inView] = useInView({ threshold: 0.12 });
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ "--delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CountUp({ value, decimals = 0, prefix = "", duration = 1400 }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [shown, setShown] = useState(0);

  const instant = prefersReducedMotion();

  useEffect(() => {
    if (!inView || instant) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 4;
      setShown(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, instant, value, duration]);

  const display = inView && instant ? value : shown;

  return (
    <span ref={ref} className="countup">
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

export function SectionHead({ index, kicker, title, children }) {
  return (
    <Reveal as="header" className="section-head">
      <p className="section-head__kicker">
        <span>{index}</span>
        {kicker}
      </p>
      <h2 className="section-head__title">{title}</h2>
      {children && <p className="section-head__lede">{children}</p>}
    </Reveal>
  );
}
