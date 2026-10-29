import { useEffect, useState } from "react";

// The vertical line with dots on the left (desktop),
// and a thin progress bar on top (phone)
export default function Rail({ sections }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      // active section = the last one whose top has passed the middle of the screen
      const middle = window.innerHeight / 2;
      let current = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < middle) current = i;
      });
      setActive(current);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return (
    <>
      <nav className="rail" aria-label="Story sections">
        <ol>
          {sections.map((s, i) => (
            <li key={s.id}>
              {i > 0 && <span className={`line ${i <= active ? "passed" : ""}`} />}
              <a
                href={`#${s.id}`}
                className={i === active ? "active" : i < active ? "done" : ""}
                aria-current={i === active ? "step" : undefined}
              >
                <span className="label" aria-hidden="true">{s.label}</span>
                <span className="sr-only">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="progress" aria-hidden="true">
        <div style={{ width: `${progress}%` }} />
      </div>
    </>
  );
}
