import { Section } from "../components/ui.jsx";
import { GITHUB_URL, SOURCE_LINKS } from "./Intro.jsx";
import { useLang } from "../i18n.jsx";

const STUDY_URL = "https://www.leeds.ac.uk/news/article/4894/how_empty_stadiums_affected_football_during_pandemic";

// 10. Conclusion and about the data
export default function Conclusion({ results, referee, players }) {
  const { t } = useLang();
  const c = t.end;
  const [before, ghost] = results.All;
  const [fans, empty] = referee.All;
  const [pFans, pEmpty] = players.All;

  const findings = [
    [`${Math.round(before.home_win - before.away_win)} → ${Math.round(ghost.home_win - ghost.away_win)}`, c.f1],
    [`+${fans.yellows.toFixed(2)} → ${Math.abs(empty.yellows).toFixed(2)}`, c.f2],
    [`${pFans.shots.toFixed(1)} → ${pEmpty.shots.toFixed(1)}`, c.f3],
  ];

  const blocks = [
    [c.sources, c.sourcesList(SOURCE_LINKS.fd, SOURCE_LINKS.dh, SOURCE_LINKS.fb)],
    [c.cleaning, c.cleaningList],
    [c.models, c.modelsList],
    [c.limits, c.limitsList],
  ];

  return (
    <Section id="conclusion">
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 860 }}>
        <p className="eyebrow">{c.eyebrow}</p>
        <h2>{c.title}</h2>
        <p className="lead">{c.lead}</p>
      </div>

      <div className="findings">
        {findings.map(([num, text]) => (
          <div className="finding" key={text}>
            <span className="big-number finding-num" dir="ltr">{num}</span>
            <p>{text}</p>
          </div>
        ))}
      </div>

      <div className="card" id="about">
        <h3>{c.about}</h3>
        <div className="about">
          {[blocks.slice(0, 2), blocks.slice(2)].map((col, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.map(([title, items]) => (
                <div key={title} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p><b>{title}</b></p>
                  <ul>
                    {items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="small">{c.agrees(<a href={STUDY_URL}>{c.study}</a>)}</p>
        <p className="small">
          {c.code} <a href={GITHUB_URL}>{c.repo}</a>
        </p>
      </div>
    </Section>
  );
}
