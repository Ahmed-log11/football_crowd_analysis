# Do Fans Win Matches?

**A data story about home advantage, referees and empty stadiums, told through 16,109 football matches.**

COVID-era ghost games created a natural experiment: the same teams and referees, with and without fans. This project collects, cleans and explores real match data to test whether the crowd affects the result, the referee and the players. It ends with an interactive story website.

## Research Questions
1. Did home advantage drop without crowds?
2. Did referee bias against away teams disappear without crowds?
3. Did home team performance (shots) drop without crowds?
4. Does the effect grow with crowd size?
5. What explains home advantage more: the referee or the players?

## Key Findings
| | Home win | Draw | Away win |
|---|---|---|---|
| Before COVID | 45.0% | 25.0% | 30.0% |
| Empty stadiums | 39.9% | 25.3% | 34.8% |
| Fans back (2022–2026) | 43.8% | 25.3% | 31.0% |

- With fans, away teams got **+0.27 extra yellow cards** per match. Without fans: **0**.
- The home team's shot advantage **halved** without fans (2.6 → 1.35).
- Any crowd brings back most of the advantage. The big difference is fans vs no fans.

## Data
| Source | What we used |
|---|---|
| [football-data.co.uk](https://www.football-data.co.uk), through [DataHub](https://datahub.io/football) | Results, shots, fouls, cards |
| [FBref](https://fbref.com) | Attendance, venue, referee |

Scope: Premier League, La Liga, Serie A, Bundesliga, Ligue 1 · seasons 2017–18 to 2025–26.

## Structure
```
data/raw/            untouched downloads (not committed)
data/clean/          matches.csv (cleaned), model_export.json
notebooks/
  01_collect.ipynb   download DataHub files, read saved FBref pages
  02_clean.ipynb     merge sources, fix team names, classify crowds, build features
  03_eda.ipynb       structure, missing values, univariate and bivariate analysis, insights
  04_model.ipynb     Elo ratings, result model (Logistic Regression), cards model (Linear Regression)
  05_export.ipynb    export chart data and the model for the website
web/                 React story website (Vite + Recharts)
```

## Run the notebooks
```bash
python -m venv .venv
.venv\Scripts\activate            # Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
```
Run the notebooks in order (01 → 05).

**FBref pages:** FBref blocks scripts, so its "Scores & Fixtures" pages are saved from the browser into `data/raw/` (Ctrl+S → "Webpage, HTML Only"). `01_collect` lists the exact URLs and file names.

## Run the website
Requires [Node.js](https://nodejs.org) 18 or newer.
```bash
cd web
npm install
npm run dev        # open the link it prints (usually http://localhost:5173)
```
The site reads its data from `web/public/data/`, made by `05_export.ipynb`.

Photo in the "twelfth man" section: [Camp Nou, by Jordiferrer](https://commons.wikimedia.org/wiki/File:Lliga_2010-11_Festa_al_Camp_Nou_-_divendres.JPG), CC BY-SA 3.0, via Wikimedia Commons.

## Deploy (free, no server needed)
The models are simple formulas, so the browser calculates the predictions itself. The site is static.

**Vercel:** import the GitHub repo → set **Root Directory** to `web` → Deploy. (Framework: Vite, build command `npm run build`, output `dist`.)
**Netlify:** same settings: base directory `web`, build command `npm run build`, publish directory `web/dist`.

## Limitations
- Ghost games happened during COVID, when other things also changed (fixture congestion, five substitutes).
- The crowd effect is an average across all teams; each team has too few ghost games to measure its own.
- Stadium capacity is estimated from each venue's biggest normal crowd.
- FBref has a few attendance typos: 7 matches outside COVID show under 3,000 fans (e.g. 13 at Getafe, 1,979 at Lyon, which really had 59,286). That's 0.04% of the data, and removing them doesn't change any reported number.
- The result model never picks a draw as the single most likely outcome (normal for football models).
