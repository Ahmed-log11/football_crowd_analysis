import { useMemo, useState } from "react";
import { Section, Select } from "../components/ui.jsx";
import { useLang } from "../i18n.jsx";
import { predictResult, predictCards, median } from "../model.js";

const AVERAGE_REF = "__average__";

// 9. Match simulator: both models from 04_model.ipynb
export default function Simulator({ model }) {
  const { t } = useLang();
  const s = t.sim;
  const leagues = Object.keys(model.teams);
  const [league, setLeague] = useState("La_Liga");
  const teamNames = Object.keys(model.teams[league]);
  const [home, setHome] = useState("Real Madrid");
  const [away, setAway] = useState("Barcelona");
  const [referee, setReferee] = useState(AVERAGE_REF);
  const [crowd, setCrowd] = useState(100);

  const refs = model.referees[league] || {};
  const avgStrictness = useMemo(() => median(Object.values(refs)), [refs]);

  function changeLeague(value) {
    const names = Object.keys(model.teams[value]);
    setLeague(value);
    setHome(names[0]);
    setAway(names[1]);
    setReferee(AVERAGE_REF);
  }

  const homeElo = model.teams[league][home];
  const awayElo = model.teams[league][away];
  const strictness = referee === AVERAGE_REF ? avgStrictness : refs[referee];

  const p = predictResult(model, homeElo - awayElo, crowd / 100);
  const cards = predictCards(model, strictness, crowd / 100);
  const pct = (x) => Math.round(x * 100);

  const outcomes = [
    { key: "H", name: s.win(home), color: "var(--orange)" },
    { key: "D", name: s.draw, color: "#8C8377" },
    { key: "A", name: s.win(away), color: "var(--green)" },
  ];

  return (
    <Section id="simulator">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 820 }}>
        <p className="eyebrow">{s.eyebrow}</p>
        <h2>{s.title}</h2>
        <p>{s.p}</p>
      </div>

      <div className="card">
        <div className="sim">
          <div className="sim-inputs">
            <Select id="sim-league" label={s.league} value={league} onChange={changeLeague}>
              {leagues.map((l) => (
                <option key={l} value={l}>{t.leagues[l]}</option>
              ))}
            </Select>
            <div className="row2">
              <Select id="sim-home" label={s.home} value={home} onChange={setHome}>
                {teamNames.filter((n) => n !== away).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
              <Select id="sim-away" label={s.away} value={away} onChange={setAway}>
                {teamNames.filter((n) => n !== home).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
            </div>
            <Select id="sim-ref" label={s.referee} value={referee} onChange={setReferee}>
              <option value={AVERAGE_REF}>{s.avgRef(avgStrictness.toFixed(1))}</option>
              {Object.entries(refs)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([name, avg]) => (
                  <option key={name} value={name}>{s.refOption(name, avg.toFixed(1))}</option>
                ))}
            </Select>
            <div className="slider-wrap">
              <div className="slider-top">
                <label htmlFor="sim-crowd" style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}>
                  {s.crowd}
                </label>
                <span className="val">{crowd === 0 ? s.empty : `${crowd}%`}</span>
              </div>
              <input
                id="sim-crowd"
                type="range"
                min="0"
                max="100"
                step="5"
                value={crowd}
                onChange={(e) => setCrowd(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="sim-output" aria-live="polite">
            <span className="card-title">{s.chance}</span>
            <div className="prob-bar" aria-hidden="true">
              {outcomes.map((o) => (
                <div key={o.key} style={{ flexGrow: p[o.key], background: o.color }}>
                  {pct(p[o.key]) >= 12 ? `${pct(p[o.key])}%` : ""}
                </div>
              ))}
            </div>
            <div className="prob-labels">
              {outcomes.map((o) => (
                <div key={o.key}>
                  <span className="pct" style={{ color: o.color }}>{pct(p[o.key])}%</span>
                  <span className="name">{o.name}</span>
                </div>
              ))}
            </div>

            <span className="card-title" style={{ marginTop: 8 }}>{s.cards}</span>
            <div className="cards-out">
              <div className="stat-card">
                <span className="small"><i className="yellow-card" aria-hidden="true" />{home}</span>
                <span className="big-number" style={{ fontSize: 40 }}>{cards.home.toFixed(1)}</span>
              </div>
              <div className="stat-card">
                <span className="small"><i className="yellow-card" aria-hidden="true" />{away}</span>
                <span className="big-number" style={{ fontSize: 40 }}>{cards.away.toFixed(1)}</span>
              </div>
            </div>
            <p className="note">{s.note}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
