import { useEffect, useState } from "react";

// Every JSON file made by notebooks/05_export.ipynb
const FILES = ["summary", "attendance", "results", "referee", "players", "crowd_size", "teams", "model_export"];

export const LEAGUE_NAMES = {
  All: "All leagues",
  EPL: "Premier League",
  La_Liga: "La Liga",
  Serie_A: "Serie A",
  Bundesliga: "Bundesliga",
  Ligue_1: "Ligue 1",
};

// Loads all the data files once, when the page opens
export function useData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all(FILES.map((name) => fetch(`/data/${name}.json`).then((r) => r.json())))
      .then((files) => {
        const all = {};
        FILES.forEach((name, i) => (all[name] = files[i]));
        setData(all);
      })
      .catch((e) => setError(e));
  }, []);

  return { data, error };
}

export const fmt = (n) => n.toLocaleString("en-US");
