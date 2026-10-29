import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { Section, LeagueChips, Tip, Legend, ChartBox, COLORS, useAxis } from "../components/ui.jsx";
import { useLang } from "../i18n.jsx";

// 4. The results: before, during and after ghost games
export default function Results({ results }) {
  const { t } = useLang();
  const r = t.results;
  const axis = useAxis();
  const [league, setLeague] = useState("All");
  const rows = results[league];
  const nums = (row) => ({
    home: Math.round(row.home_win),
    away: Math.round(row.away_win),
    gap: Math.round(row.home_win - row.away_win),
  });
  const [before, ghost, after] = rows.map(nums);
  const period = (p) => r.periods[p] || p;
  const labelStyle = { ...axis, fill: COLORS.ink, fontFamily: "IBM Plex Mono" };

  return (
    <Section id="results">
      <div className="split">
        <div className="text">
          <p className="eyebrow">{r.eyebrow}</p>
          <h2>{r.title}</h2>
          <p>{r.body(before, ghost, after)}</p>
          {league === "Serie_A" && (
            <div className="callout"><p>{r.serieA}</p></div>
          )}
          <p className="small">{r.small}</p>
        </div>
        <div className="visual card">
          <div className="card-head">
            <span className="card-title">{r.card(t.leagues[league])}</span>
            <Legend items={[{ label: r.home, color: COLORS.orange }, { label: r.away, color: COLORS.green }]} />
          </div>
          <ChartBox>
            <ResponsiveContainer>
              <BarChart data={rows} margin={{ top: 24, right: 8, bottom: 0, left: 0 }} barGap={4} barCategoryGap="28%">
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="period" tick={{ ...axis, fontSize: 12 }} interval={0} tickLine={false}
                  axisLine={{ stroke: COLORS.muted }} tickFormatter={period} />
                <YAxis tick={axis} tickLine={false} axisLine={false} width={40} unit="%" domain={[0, 55]} />
                <Tooltip content={<Tip unit="%" labelMap={period} />} cursor={{ fill: "rgba(33,30,26,0.04)" }} />
                <Bar dataKey="home_win" name={r.home} fill={COLORS.orange} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="home_win" position="top" formatter={(v) => `${Math.round(v)}%`} style={labelStyle} />
                </Bar>
                <Bar dataKey="away_win" name={r.away} fill={COLORS.green} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="away_win" position="top" formatter={(v) => `${Math.round(v)}%`} style={labelStyle} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
          <LeagueChips value={league} onChange={setLeague} />
        </div>
      </div>
    </Section>
  );
}
