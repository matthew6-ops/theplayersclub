export function detectArbitrageWithStakes(best: Record<string, number>) {
  const teams = Object.keys(best);
  if (teams.length !== 2) return null;

  const [t1, t2] = teams;
  const o1 = best[t1];
  const o2 = best[t2];

  const imp1 = 1 / o1;
  const imp2 = 1 / o2;

  const sumImp = imp1 + imp2;

  if (sumImp >= 1) return { exists: false };

  const profitPercent = (1 - sumImp) * 100;

  return {
    exists: true,
    profitPercent,
    teams: [t1, t2]
  };
}

const DEFAULT_SPORTS = [
  "basketball_nba",
  "americanfootball_nfl",
  "icehockey_nhl"
];

async function fetchOddsForSport(apiKey: string, sportKey: string) {
  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=decimal`;

  const res = await fetch(url, {
    next: { revalidate: 10 }
  });

  if (!res.ok) {
    console.error("Error fetching odds:", sportKey, res.status);
    return [];
  }

  return res.json();
}

export default async function getOpportunities() {
  const API_KEY = process.env.ODDS_API_KEY;
  if (!API_KEY) {
    console.error("Missing ODDS_API_KEY");
    return [];
  }

  const configuredSports = process.env.ODDS_SPORTS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const sportKeys = configuredSports?.length ? configuredSports : DEFAULT_SPORTS;

  const resultsBySport = await Promise.all(
    sportKeys.map((sport) => fetchOddsForSport(API_KEY, sport))
  );

  const games = resultsBySport
    .flat()
    .filter(Boolean)
    .map((game: any) => {
    const bookmakers = game.bookmakers ?? [];

    const best: Record<string, number> = {};

    bookmakers.forEach((bm: any) => {
      bm.markets?.forEach((m: any) => {
        if (m.key !== "h2h") return;

        m.outcomes?.forEach((o: any) => {
          if (!best[o.name] || o.price > best[o.name]) {
            best[o.name] = o.price;
          }
        });
      });
    });

    const arb = detectArbitrageWithStakes(best);

    return {
      id: game.id,
      sport_key: game.sport_key,
      sport_title: game.sport_title,
      home_team: game.home_team,
      away_team: game.away_team,
      commence_time: game.commence_time,
      bookmakers,
      best,
      arb
    };
  });

  return games;
}

export { getOpportunities };
