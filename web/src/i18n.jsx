import { createContext, useContext, useEffect, useState } from "react";

// All the text on the website, in English and Arabic.
// Team and referee names stay in English.

const en = {
  dir: "ltr",
  toggle: "عربي",
  toggleLabel: "اقرأ بالعربية",
  loading: "Loading…",
  error: "Couldn't load the data. Run notebooks/05_export.ipynb first.",
  footer: "Made by Ahmed Alluqmani · Tuwaiq Academy EDA project",

  leagues: {
    All: "All leagues", EPL: "Premier League", La_Liga: "La Liga",
    Serie_A: "Serie A", Bundesliga: "Bundesliga", Ligue_1: "Ligue 1",
  },
  chooseLeague: "Choose a league",
  chooseMeasure: "Choose a measure",

  rail: {
    hook: "The question", emotion: "The twelfth man", experiment: "The experiment",
    results: "The results", referee: "The referee", players: "The players",
    "crowd-size": "How many fans?", "your-team": "Your team", simulator: "Your turn", conclusion: "The answer",
  },

  hook: {
    kicker: "A data story · Europe's top 5 leagues · 2017–2026",
    github: "View the code on GitHub",
    eyebrow: "01 — The question",
    title: <>Do fans <em>win</em> matches?</>,
    lead: (n) => `This isn't a dashboard. It's a story told through ${n} football matches: before COVID, in empty stadiums, and after the fans came back.`,
    stats: ["matches", "leagues", "seasons", "played in empty stadiums"],
    glance: "The data at a glance",
    sources: (fd, dh, fb) => <>Data: {fd} (via {dh}) for results, shots, fouls and cards · {fb} for attendance and referees</>,
    scroll: "Scroll to begin",
  },

  emotion: {
    eyebrow: "02 — The twelfth man",
    title: "Emotion is part of the game. But does it change the score?",
    p1: "Fans call themselves the twelfth man. Players say the noise lifts them, and away teams say it gets inside their heads. Referees hear it too.",
    p2: "Usually we can't test any of this, because every big match has a crowd. Then, in March 2020, the crowds disappeared.",
    alt: "A packed Camp Nou before a Barcelona match, fans in the front row",
    credit: "Photo: Jordiferrer, CC BY-SA 3.0, via Wikimedia Commons",
    record: "The biggest crowd in our data: Barcelona at Camp Nou.",
  },

  experiment: {
    eyebrow: "03 — The experiment",
    title: "Overnight, every stadium went silent.",
    p1: "When football returned after the first COVID lockdown, it returned without fans. For more than a year, the same teams and referees played in empty stadiums.",
    p2: "That gave us something rare: a natural experiment. Same football, no crowd.",
    card: (league) => `Average attendance per match · ${league}`,
    series: "Attendance",
    note: "Shaded: the ghost-game period (March 2020 – May 2021). The dip in January 2022 is real: the Omicron wave brought back empty or capped stadiums in Germany, Italy and France.",
  },

  results: {
    eyebrow: "04 — The results",
    title: "The edge left with the fans, and came back with them.",
    body: (b, g, a) => <>Before COVID, home teams won <b>{b.home}%</b> of matches and away teams <b>{b.away}%</b>: a gap of <b>{b.gap} percentage points</b>. In empty stadiums the gap shrank to <b>{g.gap}</b> ({g.home}% vs {g.away}%). When the crowds returned, it was back to <b>{a.gap}</b>.</>,
    serieA: "Serie A is the exception: its home advantage barely changed without fans.",
    small: "Draws stayed at about 25% in every period. The home wins that disappeared became away wins.",
    card: (league) => `Share of matches won · ${league}`,
    home: "Home win", away: "Away win",
    periods: { "Before COVID": "Before COVID", "Empty stadiums": "Empty stadiums", "Fans back": "Fans back" },
  },

  groups: { "With fans": "With fans", "Empty stadiums": "Empty stadiums" },

  referee: {
    eyebrow: "05 — The referee",
    title: "The crowd shouts. The referee listens.",
    body: (f, e) => <>With fans in the stadium, away teams got <b>+{f}</b> more yellow cards per match than home teams. In empty stadiums, the gap was <b>{e}</b>.</>,
    p2: "Same referees, same rules. The only thing missing was the noise.",
    small: "Red cards are rare and barely changed, so the effect shows in yellow cards and fouls.",
    metrics: { yellows: "Yellow cards", fouls: "Fouls", reds_per_100: "Red cards (per 100 matches)" },
    card: (metric, league) => `Extra ${metric.toLowerCase()} for the away team · ${league}`,
    series: "Away minus home",
    note: "Above 0: the away team got more than the home team.",
  },

  players: {
    eyebrow: "06 — The players",
    title: "It's not only the referee.",
    body: (f, e) => <>Referees don't decide how many shots a team takes. Yet with fans behind them, home teams had <b>{f}</b> more shots than their visitors. In empty stadiums: <b>{e}</b>, about half.</>,
    p2: "The crowd pushes the players forward too.",
    metrics: { shots: "Shots", shots_on_target: "Shots on target" },
    card: (metric, league) => `Extra ${metric.toLowerCase()} for the home team · ${league}`,
    series: "Home minus away",
  },

  crowd: {
    eyebrow: "07 — How many fans?",
    title: "You don't need a full stadium. You need a crowd.",
    body: (e, u, f) => <>In empty stadiums, home teams won <b>{e}%</b> of matches. With a stadium less than half full, it was already <b>{u}%</b>. Half full or more: <b>{f}%</b>.</>,
    small: "Most of the advantage comes back as soon as there is a crowd. Filling the rest of the stadium adds only a little more. Crowds under half full are mostly from 2020–2022, when stadiums had limits.",
    card: "Home win % by how full the stadium was",
    empty: "Empty",
    groups: { Empty: "Empty", "Under half full": "Under half full", "Half full or more": "Half full or more" },
    matches: "Matches per group",
  },

  team: {
    eyebrow: "08 — Your team",
    title: "Did your team miss its fans?",
    p: "Pick a team to compare its home record with fans and in empty stadiums.",
    small: "Most teams played fewer than 20 home matches without fans, so single teams can swing a lot by chance. The league-wide numbers above are more reliable.",
    league: "League", team: "Team",
    fans: "With fans", empty: "Empty stadiums",
    line: (n, pts) => `home wins · ${n} matches · ${pts} pts per game`,
    change: (team, c) =>
      c < 0 ? `${team} won ${Math.abs(c)} points less often at home without fans.`
        : c > 0 ? `${team} actually won ${c} points more often at home without fans.`
        : `${team} won just as often at home without fans.`,
  },

  sim: {
    eyebrow: "09 — Your turn",
    title: "Play the match. Then empty the stadium.",
    p: "Pick two teams and a referee, then move the crowd slider. The chances come from our model, built from 14,000+ matches, using each team's current strength and how full the stadium is.",
    league: "League", home: "Home team", away: "Away team",
    referee: "Referee (average yellow cards per match)",
    avgRef: (v) => `Average referee (${v} cards)`,
    refOption: (name, v) => `${name} (${v} cards)`,
    crowd: "Crowd: how full is the stadium?",
    empty: "Empty",
    chance: "Chance of each result",
    win: (team) => `${team} win`,
    draw: "Draw",
    cards: "Expected yellow cards",
    note: "Team strength is each team's Elo rating at the end of the 2025–26 season. These are average chances, not a forecast: football has a lot of luck.",
  },

  end: {
    eyebrow: "10 — The answer",
    title: "Yes. Fans win matches, a little.",
    lead: "The crowd doesn't decide every game, but it tilts the field. It pushes the players forward, and it pushes the referee against the visitors.",
    f1: "The gap between home and away wins, in points, before COVID and in empty stadiums.",
    f2: "Extra yellow cards per match for the away team, with fans and without.",
    f3: "Extra shots per match for the home team, with fans and without.",
    about: "About the data",
    sources: "Sources",
    sourcesList: (fd, dh, fb) => [
      <>{fd}, through {dh}: results, shots, fouls and cards.</>,
      <>{fb}: attendance, venues and referees.</>,
      "Premier League, La Liga, Serie A, Bundesliga and Ligue 1, seasons 2017–18 to 2025–26.",
    ],
    cleaning: "Cleaning",
    cleaningList: [
      "Merged the two sources match by match, after matching 42 team names spelled differently.",
      "Removed cancelled matches, relegation play-offs and two matches that weren't finished.",
      "Blank attendance from March 2020 to July 2021 counted as a ghost game. Blank attendance outside that period was left out.",
    ],
    models: "Models",
    modelsList: [
      "Result: Logistic Regression on team strength (Elo rating) and stadium fill. About 52% accurate, against 43% for always picking the home team.",
      "Yellow cards: Linear Regression on referee strictness and stadium fill.",
    ],
    limits: "Limitations",
    limitsList: [
      "Ghost games happened during COVID, when other things also changed (fixture congestion, five substitutes).",
      "The crowd effect is an average across all teams.",
      "Stadium capacity is estimated from each venue's biggest normal crowd.",
    ],
    agrees: (link) => <>Our results agree with a study by the universities of Leeds and Northumbria on 4,844 matches from the 2019–20 season: {link}.</>,
    study: "read the study",
    code: "Code, notebooks and data:",
    repo: "GitHub repository",
  },
};

const ar = {
  dir: "rtl",
  toggle: "English",
  toggleLabel: "Read in English",
  loading: "جاري التحميل…",
  error: "تعذّر تحميل البيانات. شغّل notebooks/05_export.ipynb أولًا.",
  footer: "إعداد أحمد اللقماني · مشروع تحليل البيانات الاستكشافي · أكاديمية طويق",

  leagues: {
    All: "كل الدوريات", EPL: "الدوري الإنجليزي", La_Liga: "الدوري الإسباني",
    Serie_A: "الدوري الإيطالي", Bundesliga: "الدوري الألماني", Ligue_1: "الدوري الفرنسي",
  },
  chooseLeague: "اختر الدوري",
  chooseMeasure: "اختر المقياس",

  rail: {
    hook: "السؤال", emotion: "اللاعب رقم 12", experiment: "التجربة",
    results: "النتائج", referee: "الحكم", players: "اللاعبون",
    "crowd-size": "كم مشجعًا؟", "your-team": "فريقك", simulator: "دورك", conclusion: "الجواب",
  },

  hook: {
    kicker: "قصة بالبيانات · أكبر 5 دوريات أوروبية · 2017–2026",
    github: "GitHub",
    eyebrow: "01 — السؤال",
    title: <>هل يصنع الجمهور <em>الفوز</em>؟</>,
    lead: (n) => `هذه ليست لوحة بيانات، بل قصة نرويها من خلال ${n} مباراة كرة قدم: قبل كورونا، وفي الملاعب الفارغة، وبعد عودة الجماهير.`,
    stats: ["مباراة", "دوريات", "مواسم", "لُعبت بدون جمهور"],
    glance: "البيانات في لمحة",
    sources: (fd, dh, fb) => <>البيانات: {fd} (عبر {dh}) للنتائج والتسديدات والأخطاء والبطاقات · {fb} للحضور والحكام</>,
    scroll: "ابدأ القصة",
  },

  emotion: {
    eyebrow: "02 — اللاعب رقم 12",
    title: "العاطفة جزء من اللعبة. لكن هل تغيّر النتيجة؟",
    p1: "يسمّي المشجعون أنفسهم اللاعب رقم 12. اللاعبون يقولون إن الهتاف يرفع معنوياتهم، والفرق الضيفة تقول إنه يربكها. والحكام يسمعونه أيضًا.",
    p2: "عادةً لا يمكن اختبار ذلك، لأن كل مباراة كبيرة فيها جمهور. ثم في مارس 2020، اختفت الجماهير.",
    alt: "ملعب كامب نو ممتلئ بالجماهير قبل مباراة لبرشلونة",
    credit: "الصورة: Jordiferrer، رخصة CC BY-SA 3.0، عبر ويكيميديا كومنز",
    record: "أكبر حضور في بياناتنا: برشلونة في كامب نو.",
  },

  experiment: {
    eyebrow: "03 — التجربة",
    title: "بين ليلة وضحاها، صمتت كل الملاعب.",
    p1: "عندما عادت كرة القدم بعد الإغلاق الأول بسبب كورونا، عادت بدون جماهير. ولأكثر من سنة، لعبت نفس الفرق مع نفس الحكام في ملاعب فارغة.",
    p2: "وهذا أعطانا شيئًا نادرًا: تجربة طبيعية. نفس كرة القدم، لكن بدون جمهور.",
    card: (league) => `متوسط الحضور في المباراة · ${league}`,
    series: "الحضور",
    note: "المنطقة المظللة: فترة المباريات بدون جمهور (مارس 2020 – مايو 2021). والانخفاض في يناير 2022 حقيقي: موجة أوميكرون أعادت الملاعب الفارغة أو المحدودة في ألمانيا وإيطاليا وفرنسا.",
  },

  results: {
    eyebrow: "04 — النتائج",
    title: "رحلت الأفضلية مع الجماهير، وعادت معهم.",
    body: (b, g, a) => <>قبل كورونا، فاز المستضيف في <b>{b.home}%</b> من المباريات والضيف في <b>{b.away}%</b>، أي بفارق <b>{b.gap} نقطة مئوية</b>. في الملاعب الفارغة انكمش الفارق إلى <b>{g.gap}</b> فقط ({g.home}% مقابل {g.away}%). وعندما عادت الجماهير، عاد إلى <b>{a.gap}</b>.</>,
    serieA: "الدوري الإيطالي هو الاستثناء: أفضلية الأرض فيه لم تتغير تقريبًا بدون جمهور.",
    small: "بقيت نسبة التعادل حوالي 25% في كل الفترات، أي أن انتصارات المستضيف التي اختفت تحولت إلى انتصارات للضيف.",
    card: (league) => `نسبة المباريات التي فاز بها كل فريق · ${league}`,
    home: "فوز المستضيف", away: "فوز الضيف",
    periods: { "Before COVID": "قبل كورونا", "Empty stadiums": "بدون جمهور", "Fans back": "بعد عودة الجمهور" },
  },

  groups: { "With fans": "مع الجمهور", "Empty stadiums": "بدون جمهور" },

  referee: {
    eyebrow: "05 — الحكم",
    title: "الجمهور يهتف، والحكم يسمع.",
    body: (f, e) => <>بوجود الجمهور، حصل الفريق الضيف على <b>+{f}</b> بطاقة صفراء إضافية في المباراة مقارنة بالمستضيف. وفي الملاعب الفارغة، كان الفارق <b>{e}</b> فقط.</>,
    p2: "نفس الحكام ونفس القوانين. الشيء الوحيد الذي غاب هو الصوت.",
    small: "البطاقات الحمراء نادرة ولم تتغير كثيرًا، لذلك يظهر التأثير في البطاقات الصفراء والأخطاء.",
    metrics: { yellows: "البطاقات الصفراء", fouls: "الأخطاء", reds_per_100: "البطاقات الحمراء (لكل 100 مباراة)" },
    card: (metric, league) => `${metric} الإضافية على الضيف · ${league}`,
    series: "الضيف ناقص المستضيف",
    note: "فوق الصفر: الضيف حصل على أكثر من المستضيف.",
  },

  players: {
    eyebrow: "06 — اللاعبون",
    title: "ليس الحكم وحده.",
    body: (f, e) => <>الحكم لا يقرر عدد تسديدات الفريق. ومع ذلك، بوجود الجمهور خلفه، سدد المستضيف <b>{f}</b> تسديدة أكثر من الضيف. وفي الملاعب الفارغة: <b>{e}</b> فقط، أي النصف تقريبًا.</>,
    p2: "الجمهور يدفع اللاعبين للأمام أيضًا.",
    metrics: { shots: "التسديدات", shots_on_target: "التسديدات على المرمى" },
    card: (metric, league) => `${metric} الإضافية للمستضيف · ${league}`,
    series: "المستضيف ناقص الضيف",
  },

  crowd: {
    eyebrow: "07 — كم مشجعًا؟",
    title: "لا تحتاج ملعبًا ممتلئًا. تحتاج جمهورًا.",
    body: (e, u, f) => <>في الملاعب الفارغة، فاز المستضيف في <b>{e}%</b> من المباريات. ومع ملعب أقل من نصف ممتلئ، صارت النسبة <b>{u}%</b>. ومع نصف الملعب أو أكثر: <b>{f}%</b>.</>,
    small: "أغلب الأفضلية تعود بمجرد وجود جمهور، وامتلاء بقية الملعب يضيف القليل فقط. الحضور الأقل من النصف أغلبه من فترة 2020–2022، عندما كانت هناك قيود على الحضور.",
    card: "نسبة فوز المستضيف حسب امتلاء الملعب",
    empty: "فارغ",
    groups: { Empty: "فارغ", "Under half full": "أقل من النصف", "Half full or more": "النصف أو أكثر" },
    matches: "عدد المباريات في كل فئة",
  },

  team: {
    eyebrow: "08 — فريقك",
    title: "هل افتقد فريقك جمهوره؟",
    p: "اختر فريقًا لتقارن نتائجه على أرضه مع الجمهور وبدونه.",
    small: "أغلب الفرق لعبت أقل من 20 مباراة على أرضها بدون جمهور، لذلك قد تتأثر أرقام الفريق الواحد بالحظ. أرقام الدوري كاملًا في الأعلى أكثر دقة.",
    league: "الدوري", team: "الفريق",
    fans: "مع الجمهور", empty: "بدون جمهور",
    line: (n, pts) => `فوز على أرضه · ${n} مباراة · ${pts} نقطة في المباراة`,
    change: (team, c) =>
      c < 0 ? `${team} فاز على أرضه أقل بـ${Math.abs(c)} نقطة مئوية بدون جمهور.`
        : c > 0 ? `${team} فاز على أرضه أكثر بـ${c} نقطة مئوية بدون جمهور.`
        : `${team} فاز على أرضه بنفس النسبة بدون جمهور.`,
  },

  sim: {
    eyebrow: "09 — دورك",
    title: "العب المباراة، ثم أفرغ الملعب.",
    p: "اختر فريقين وحكمًا، ثم حرّك مؤشر الجمهور. الاحتمالات من نموذجنا المبني على أكثر من 14,000 مباراة، باستخدام قوة كل فريق الحالية ونسبة امتلاء الملعب.",
    league: "الدوري", home: "المستضيف", away: "الضيف",
    referee: "الحكم (متوسط البطاقات الصفراء في المباراة)",
    avgRef: (v) => `حكم متوسط (${v} بطاقة)`,
    refOption: (name, v) => `${name} (${v} بطاقة)`,
    crowd: "الجمهور: كم نسبة امتلاء الملعب؟",
    empty: "فارغ",
    chance: "احتمال كل نتيجة",
    win: (team) => `فوز ${team}`,
    draw: "تعادل",
    cards: "البطاقات الصفراء المتوقعة",
    note: "قوة الفريق هي تقييم Elo في نهاية موسم 2025–26. هذه احتمالات متوسطة وليست توقعًا مؤكدًا، فكرة القدم فيها حظ كثير.",
  },

  end: {
    eyebrow: "10 — الجواب",
    title: "نعم، الجمهور يساهم في الفوز، ولو قليلًا.",
    lead: "الجمهور لا يحسم كل مباراة، لكنه يميل بالملعب. يدفع اللاعبين للأمام، ويدفع الحكم ضد الفريق الضيف.",
    f1: "الفارق بين فوز المستضيف وفوز الضيف بالنقاط المئوية، قبل كورونا وفي الملاعب الفارغة.",
    f2: "البطاقات الصفراء الإضافية على الضيف في المباراة، مع الجمهور وبدونه.",
    f3: "التسديدات الإضافية للمستضيف في المباراة، مع الجمهور وبدونه.",
    about: "عن البيانات",
    sources: "المصادر",
    sourcesList: (fd, dh, fb) => [
      <>{fd} عبر {dh}: النتائج والتسديدات والأخطاء والبطاقات.</>,
      <>{fb}: الحضور والملاعب والحكام.</>,
      "الدوري الإنجليزي والإسباني والإيطالي والألماني والفرنسي، من موسم 2017–18 إلى 2025–26.",
    ],
    cleaning: "التنظيف",
    cleaningList: [
      "دمج المصدرين مباراة بمباراة، بعد توحيد 42 اسم فريق مكتوب بشكل مختلف.",
      "حذف المباريات الملغاة ومباريات الهبوط الفاصلة ومباراتين لم تكتملا.",
      "الحضور الفارغ بين مارس 2020 ويوليو 2021 اعتُبر مباراة بدون جمهور، وما كان خارج هذه الفترة استُبعد.",
    ],
    models: "النماذج",
    modelsList: [
      "النتيجة: Logistic Regression باستخدام قوة الفريق (تقييم Elo) ونسبة امتلاء الملعب. دقته حوالي 52%، مقابل 43% عند اختيار فوز المستضيف دائمًا.",
      "البطاقات الصفراء: Linear Regression باستخدام صرامة الحكم ونسبة امتلاء الملعب.",
    ],
    limits: "حدود الدراسة",
    limitsList: [
      "المباريات بدون جمهور كانت خلال كورونا، حين تغيرت أشياء أخرى أيضًا (ضغط المباريات، والتبديلات الخمسة).",
      "تأثير الجمهور متوسط لكل الفرق، وليس لكل فريق على حدة.",
      "سعة الملعب تقديرية، من أكبر حضور سجّله الملعب في مباراة عادية.",
    ],
    agrees: (link) => <>نتائجنا تتفق مع دراسة لجامعتي ليدز ونورثمبريا على 4,844 مباراة من موسم 2019–20: {link}.</>,
    study: "اقرأ الدراسة",
    code: "الكود والنوتبوكات والبيانات:",
    repo: "مستودع GitHub",
  },
};

const TEXT = { en, ar };
const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("lang") === "ar" ? "ar" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = TEXT[lang].dir;
    try {
      localStorage.setItem("lang", lang);
    } catch {
      // storage not available: the choice just isn't remembered
    }
  }, [lang]);

  const toggle = () => setLang((l) => (l === "en" ? "ar" : "en"));
  return <LangContext.Provider value={{ lang, t: TEXT[lang], toggle }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
