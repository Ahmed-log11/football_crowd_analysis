import { useState } from "react";
import { Section } from "../components/ui.jsx";
import { fmt } from "../data.js";
import { useLang } from "../i18n.jsx";

export const GITHUB_URL = "https://github.com/Ahmed-log11/football_crowd_analysis";

export const SOURCE_LINKS = {
  fd: <a href="https://www.football-data.co.uk">football-data.co.uk</a>,
  dh: <a href="https://datahub.io/football">DataHub</a>,
  fb: <a href="https://fbref.com">FBref</a>,
};

// 1. The hook
export function Hook({ summary }) {
  const { t } = useLang();
  const h = t.hook;
  const values = [fmt(summary.matches), summary.leagues, summary.seasons, fmt(summary.ghost_games)];

  return (
    <Section id="hook" className="hook">
      <div className="hook-top">
        <p className="kicker">{h.kicker}</p>
        <a href={GITHUB_URL} style={{ fontSize: 15, fontWeight: 500 }}>{h.github}</a>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <p className="eyebrow">{h.eyebrow}</p>
        <h1>{h.title}</h1>
        <p className="lead">{h.lead(fmt(summary.matches))}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="stats" aria-label={h.glance}>
          {values.map((v, i) => (
            <div key={i}>
              <span className="num" style={i === 3 ? { color: "var(--green)" } : undefined}>{v}</span>
              <span className="lbl">{h.stats[i]}</span>
            </div>
          ))}
        </div>
        <div className="hook-bottom">
          <p className="small">{h.sources(SOURCE_LINKS.fd, SOURCE_LINKS.dh, SOURCE_LINKS.fb)}</p>
          <a className="pill-dark" href="#emotion">
            {h.scroll}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" />
            </svg>
          </a>
        </div>
      </div>
    </Section>
  );
}

// 2. Emotion. Shows public/images/fans.jpg if it exists, otherwise a text panel.
export function Emotion() {
  const { t } = useLang();
  const e = t.emotion;
  const [hasPhoto, setHasPhoto] = useState(true);

  return (
    <Section id="emotion">
      <div className="split">
        <div className="text">
          <p className="eyebrow">{e.eyebrow}</p>
          <h2>{e.title}</h2>
          <p>{e.p1}</p>
          <p>{e.p2}</p>
        </div>
        <div className="visual">
          {hasPhoto ? (
            <figure className="photo-wrap">
              <div className="photo-box">
                <img className="photo" src="/images/fans.jpg" alt={e.alt} onError={() => setHasPhoto(false)} />
                <div className="photo-caption">
                  <span className="big-number">97,939</span>
                  <p>{e.record}</p>
                </div>
              </div>
              <figcaption>
                <a href="https://commons.wikimedia.org/wiki/File:Lliga_2010-11_Festa_al_Camp_Nou_-_divendres.JPG">{e.credit}</a>
              </figcaption>
            </figure>
          ) : (
            <div className="noise">
              <span className="big-number">97,939</span>
              <p>{e.record}</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
