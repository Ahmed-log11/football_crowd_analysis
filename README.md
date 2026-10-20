# Home Advantage in Football: The Crowd Effect

Does the crowd affect the referee, and does it affect who wins?

COVID-era empty stadiums created a natural experiment. This project uses real match data to test:

**Crowd → Referee → Result** and **Crowd → Players → Result**

## Research Questions
1. Did home advantage drop without crowds?
2. Did referee bias against away teams disappear without crowds?
3. Did home team performance drop without crowds?
4. Does the effect grow with attendance size?
5. What explains home advantage more: the referee or player performance?

## Data
- [FBref](https://fbref.com): match attendance, referee, venue
- [football-data.co.uk](https://www.football-data.co.uk): fouls, cards, shots, odds

Scope: top 5 European leagues, 2017–18 to 2022–23.

## Structure
```
data/raw/      untouched downloads (not committed)
data/clean/    cleaned datasets
notebooks/     01_collect → 02_clean → 03_eda → 04_model
src/           reusable helper functions
web/           React explorer
```

## Setup
```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```
