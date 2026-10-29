import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Cell } from "recharts";
import { Section, Select, Tip, ChartBox, COLORS, useAxis } from "../components/ui.jsx";
import { useLang } from "../i18n.jsx";

// 7. Crowd size
export function CrowdSize({ crowd }) {
  const { t } = useLang();
  const c = t.crowd;
  const axis = useAxis();
  const [empty, under, full] = crowd.map((g) => Math.round(g.home_win));
  const fill = (f) => c.groups[f] || f;

  return (
    <Section id="crowd-size">
      <div className="split">
        <div className="text">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2>{c.title}</h2>
          <p>{c.body(empty, under, full)}</p>
          <p className="small">{c.small}</p>
        </div>
        <div className="visual card">
          <div className="card-head">
            <span className="card-title">{c.card}</span>
          </div>
          <ChartBox>
            <ResponsiveContainer>
              <BarChart data={crowd} margin={{ top: 24, right: 8, bottom: 0, left: 0 }} barCategoryGap="34%">
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="fill" tick={{ ...axis, fontSize: 12 }} interval={0} tickLine={false}
                  axisLine={{ stroke: COLORS.muted }} tickFormatter={fill} />
                <YAxis tick={axis} tickLine={false} axisLine={false} width={40} unit="%" domain={[0, 55]} />
                <Tooltip content={<Tip unit="%" labelMap={fill} />} cursor={{ fill: "rgba(33,30,26,0.04)" }} />
                <Bar dataKey="home_win" name={t.results.home} radius={[4, 4, 0, 0]}>
                  {crowd.map((g) => (
                    <Cell key={g.fill} fill={g.fill === "Empty" ? COLORS.green : COLORS.orange} />
                  ))}
                  <LabelList dataKey="home_win" position="top" formatter={(v) => `${Math.round(v)}%`}
                    style={{ ...axis, fill: COLORS.ink, fontFamily: "IBM Plex Mono" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
          <p className="note">
            {c.matches}: {crowd.map((g) => `${fill(g.fill)} ${g.matches.toLocaleString("en-US")}`).join(" · ")}
          </p>
        </div>
      </div>
    </Section>
  );
}

// 8. Your team
export function YourTeam({ teams }) {
  const { t } = useLang();
  const y = t.team;
  const [league, setLeague] = useState("EPL");
  const [teamName, setTeamName] = useState("Liverpool");

  const list = teams[league];
  const team = list.find((tm) => tm.team === teamName) || list[0];

  function changeLeague(value) {
    setLeague(value);
    setTeamName(teams[value][0].team);
  }

  const change = Math.round(team.ghost_win - team.fans_win);

  return (
    <Section id="your-team">
      <div className="split">
        <div className="text">
          <p className="eyebrow">{y.eyebrow}</p>
          <h2>{y.title}</h2>
          <p>{y.p}</p>
          <p className="small">{y.small}</p>
        </div>
        <div className="visual card">
          <div className="row2">
            <Select id="team-league" label={y.league} value={league} onChange={changeLeague}>
              {Object.keys(teams).map((l) => (
                <option key={l} value={l}>{t.leagues[l]}</option>
              ))}
            </Select>
            <Select id="team-name" label={y.team} value={team.team} onChange={setTeamName}>
              {list.map((tm) => (
                <option key={tm.team} value={tm.team}>{tm.team}</option>
              ))}
            </Select>
          </div>
          <div className="pair">
            <div className="stat-card">
              <span className="small">{y.fans}</span>
              <span className="big-number" style={{ color: "var(--orange)" }}>{Math.round(team.fans_win)}%</span>
              <span className="small">{y.line(team.fans_matches, team.fans_points)}</span>
            </div>
            <div className="stat-card">
              <span className="small">{y.empty}</span>
              <span className="big-number" style={{ color: "var(--green)" }}>{Math.round(team.ghost_win)}%</span>
              <span className="small">{y.line(team.ghost_matches, team.ghost_points)}</span>
            </div>
          </div>
          <p style={{ fontWeight: 500, color: "var(--ink)" }}>{y.change(team.team, change)}</p>
        </div>
      </div>
    </Section>
  );
}
