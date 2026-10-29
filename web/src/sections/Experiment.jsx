import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from "recharts";
import { Section, LeagueChips, Tip, ChartBox, COLORS, useAxis } from "../components/ui.jsx";
import { useLang } from "../i18n.jsx";

// 3. The experiment: attendance over time
export default function Experiment({ attendance }) {
  const { t } = useLang();
  const x = t.experiment;
  const axis = useAxis();
  const [league, setLeague] = useState("All");

  // one label per year: the first month of each new year (skips 2017, which starts in August)
  const yearTicks = attendance
    .filter((row, i) => i > 0 && row.month.slice(0, 4) !== attendance[i - 1].month.slice(0, 4))
    .map((row) => row.month);

  return (
    <Section id="experiment">
      <div className="split">
        <div className="text">
          <p className="eyebrow">{x.eyebrow}</p>
          <h2>{x.title}</h2>
          <p>{x.p1}</p>
          <p>{x.p2}</p>
        </div>
        <div className="visual card">
          <div className="card-head">
            <span className="card-title">{x.card(t.leagues[league])}</span>
          </div>
          <ChartBox>
            <ResponsiveContainer>
              <LineChart data={attendance} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke={COLORS.grid} vertical={false} />
                <ReferenceArea x1="2020-03" x2="2021-05" fill={COLORS.green} fillOpacity={0.1} ifOverflow="extendDomain" />
                <XAxis dataKey="month" tick={axis} tickLine={false} axisLine={{ stroke: COLORS.muted }}
                  ticks={yearTicks} interval={0} tickFormatter={(m) => m.slice(0, 4)} />
                <YAxis tick={axis} tickLine={false} axisLine={false} width={48}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
                <Tooltip content={<Tip digits={0} />} />
                <Line type="monotone" dataKey={league} name={x.series} stroke={COLORS.orange}
                  strokeWidth={2} dot={false} connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
          <p className="note">{x.note}</p>
          <LeagueChips value={league} onChange={setLeague} />
        </div>
      </div>
    </Section>
  );
}
