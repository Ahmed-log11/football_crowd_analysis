import { useData } from "./data.js";
import { useLang } from "./i18n.jsx";
import Rail from "./components/Rail.jsx";
import { Hook, Emotion } from "./sections/Intro.jsx";
import Experiment from "./sections/Experiment.jsx";
import Results from "./sections/Results.jsx";
import { Referee, Players } from "./sections/Referee.jsx";
import { CrowdSize, YourTeam } from "./sections/CrowdTeam.jsx";
import Simulator from "./sections/Simulator.jsx";
import Conclusion from "./sections/Conclusion.jsx";

const SECTION_IDS = [
  "hook", "emotion", "experiment", "results", "referee",
  "players", "crowd-size", "your-team", "simulator", "conclusion",
];

export default function App() {
  const { data, error } = useData();
  const { t, toggle } = useLang();

  if (error) return <p style={{ padding: 32 }}>{t.error}</p>;
  if (!data) return <p style={{ padding: 32 }} className="small">{t.loading}</p>;

  const sections = SECTION_IDS.map((id) => ({ id, label: t.rail[id] }));

  return (
    <>
      <button type="button" className="lang-toggle" onClick={toggle} aria-label={t.toggleLabel}>
        {t.toggle}
      </button>
      <Rail sections={sections} />
      <main>
        <Hook summary={data.summary} />
        <Emotion />
        <Experiment attendance={data.attendance} />
        <Results results={data.results} />
        <Referee referee={data.referee} />
        <Players players={data.players} />
        <CrowdSize crowd={data.crowd_size} />
        <YourTeam teams={data.teams} />
        <Simulator model={data.model_export} />
        <Conclusion results={data.results} referee={data.referee} players={data.players} />
      </main>
      <footer>{t.footer}</footer>
    </>
  );
}
