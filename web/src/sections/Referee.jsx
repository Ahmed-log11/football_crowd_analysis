import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, LabelList, Cell } from "recharts";
import { Section, LeagueChips, Chips, Tip, ChartBox, COLORS, useAxis } from "../components/ui.jsx";
import { useLang } from "../i18n.jsx";

const REF_DIGITS = { yellows: 2, fouls: 2, reds_per_100: 1 };
const PLAYER_DIGITS = { shots: 2, shots_on_target: 2 };

function DiffChart({ rows, metric, digits, name }) {
  const { t } = useLang();
  const axis = useAxis();
  const group = (g) => t.groups[g] || g;

  return (
    <ChartBox>
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 28, right: 8, bottom: 0, left: 0 }} barCategoryGap="38%">
          <CartesianGrid stroke={COLORS.grid} vertical={false} />
          <XAxis dataKey="group" tick={axis} tickLine={false} axisLine={false} tickFormatter={group} />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={40} />
          <ReferenceLine y={0} stroke={COLORS.muted} />
          <Tooltip content={<Tip digits={digits} labelMap={group} />} cursor={{ fill: "rgba(33,30,26,0.04)" }} />
          <Bar dataKey={metric} name={name} radius={[4, 4, 4, 4]}>
            {rows.map((r) => (
              <Cell key={r.group} fill={r.group === "With fans" ? COLORS.orange : COLORS.green} />
            ))}
            <LabelList dataKey={metric} position="top"
              formatter={(v) => (v > 0 ? "+" : "") + v.toFixed(digits)}
              style={{ ...axis, fill: COLORS.ink, fontFamily: "IBM Plex Mono" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

// 5. The referee
export function Referee({ referee }) {
  const { t } = useLang();
  const r = t.referee;
  const [league, setLeague] = useState("All");
  const [metric, setMetric] = useState("yellows");
  const [fans, empty] = referee.All;
  const options = Object.keys(REF_DIGITS).map((k) => ({ value: k, label: r.metrics[k] }));

  return (
    <Section id="referee">
      <div className="split">
        <div className="text">
          <p className="eyebrow">{r.eyebrow}</p>
          <h2>{r.title}</h2>
          <p>{r.body(fans.yellows.toFixed(2), Math.abs(empty.yellows).toFixed(2))}</p>
          <p>{r.p2}</p>
          <p className="small">{r.small}</p>
        </div>
        <div className="visual card">
          <div className="card-head">
            <span className="card-title">{r.card(r.metrics[metric], t.leagues[league])}</span>
          </div>
          <DiffChart rows={referee[league]} metric={metric} digits={REF_DIGITS[metric]} name={r.series} />
          <p className="note">{r.note}</p>
          <Chips options={options} value={metric} onChange={setMetric} label={t.chooseMeasure} />
          <LeagueChips value={league} onChange={setLeague} />
        </div>
      </div>
    </Section>
  );
}

// 6. The players
export function Players({ players }) {
  const { t } = useLang();
  const p = t.players;
  const [league, setLeague] = useState("All");
  const [metric, setMetric] = useState("shots");
  const [fans, empty] = players.All;
  const options = Object.keys(PLAYER_DIGITS).map((k) => ({ value: k, label: p.metrics[k] }));

  return (
    <Section id="players">
      <div className="split">
        <div className="text">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2>{p.title}</h2>
          <p>{p.body(fans.shots.toFixed(1), empty.shots.toFixed(1))}</p>
          <p>{p.p2}</p>
        </div>
        <div className="visual card">
          <div className="card-head">
            <span className="card-title">{p.card(p.metrics[metric], t.leagues[league])}</span>
          </div>
          <DiffChart rows={players[league]} metric={metric} digits={PLAYER_DIGITS[metric]} name={p.series} />
          <Chips options={options} value={metric} onChange={setMetric} label={t.chooseMeasure} />
          <LeagueChips value={league} onChange={setLeague} />
        </div>
      </div>
    </Section>
  );
}
