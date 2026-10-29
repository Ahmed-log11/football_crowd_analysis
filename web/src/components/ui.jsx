import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n.jsx";

// A story section that fades in when it scrolls into view
export function Section({ id, className = "", children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className={`section ${className}`}>
      <div className={`inner reveal ${visible ? "in" : ""}`}>{children}</div>
    </section>
  );
}

// Row of buttons to choose one option
export function Chips({ options, value, onChange, label }) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="chip"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function LeagueChips({ value, onChange }) {
  const { t } = useLang();
  const options = Object.keys(t.leagues).map((key) => ({ value: key, label: t.leagues[key] }));
  return <Chips options={options} value={value} onChange={onChange} label={t.chooseLeague} />;
}

export function Select({ id, label, value, onChange, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </div>
  );
}

// Dark tooltip used by all charts
export function Tip({ active, payload, label, unit = "", digits = 1, labelMap }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="tip">
      <b>{labelMap ? labelMap(label) : label}</b>
      {payload.map((p) => (
        <div key={p.dataKey}>
          {p.name}: {p.value === null ? "–" : Number(p.value).toFixed(digits)}
          {unit}
        </div>
      ))}
    </div>
  );
}

export function Legend({ items }) {
  return (
    <div className="legend" aria-hidden="true">
      {items.map((it) => (
        <span key={it.label}>
          <i className="swatch" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

// Charts always read left to right, also on the Arabic page
export function ChartBox({ children }) {
  return (
    <div className="chart" dir="ltr">
      {children}
    </div>
  );
}

export const COLORS = { orange: "#C2612C", green: "#2F5D50", muted: "#B8AE9F", grid: "#E6DFD2", ink: "#211E1A" };

export function useAxis() {
  const { lang } = useLang();
  return { fontSize: 13, fill: "#6E675E", fontFamily: lang === "ar" ? "IBM Plex Sans Arabic" : "IBM Plex Sans" };
}
