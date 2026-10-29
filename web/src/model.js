// The two models from notebooks/04_model.ipynb, calculated in the browser.
// The numbers (coefficients) come from model_export.json.

// Logistic Regression: chance of away win (A), draw (D), home win (H)
export function predictResult(model, eloDiff, crowd) {
  const { coef, intercept, classes } = model.result_model;
  const scores = coef.map((c, i) => c[0] * eloDiff + c[1] * crowd + intercept[i]);
  const exps = scores.map((s) => Math.exp(s));
  const total = exps.reduce((a, b) => a + b, 0);

  const result = {};
  classes.forEach((cls, i) => (result[cls] = exps[i] / total));
  return result; // { A, D, H } each between 0 and 1
}

// Linear Regression: expected yellow cards for each team
export function predictCards(model, refStrictness, crowd) {
  const calc = (m) => m.intercept + m.coef[0] * refStrictness + m.coef[1] * crowd;
  return {
    home: Math.max(0, calc(model.cards_model.home_yellows)),
    away: Math.max(0, calc(model.cards_model.away_yellows)),
  };
}

export function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
