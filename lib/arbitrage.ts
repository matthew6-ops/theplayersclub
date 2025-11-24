import { revalidateTag } from "next/cache";

/**
 * Your pure math helper (kept unchanged)
 */
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

  function stake(total: number) {
    const s1 = (total * imp1) / sumImp;
    const s2 = (total * imp2) / sumImp;
    return {
      stake1: s1,
      stake2: s2,
      guaranteedProfit: total - (s1 + s2)
    };
  }

  return {
    exists: true,
    profitPercent,
    stakeCalc: stake,
    teams: [t1, t2]
  };
}

/**
 * Fetch + process odds + compute EV & arbitrage
 */
export async function getOpportunities() {
  const API_KEY = process.env.ODDS_API_KEY;
  if (!API_KEY) {
    console.error("Missing ODDS_API_KEY");
    return [];
  }

  const url = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=decimal`;

  const res = await fetch(url, { next: { revalidate: 10 } });

  if (!res.ok) {
    console.error("Error fetching odds:", res.status);
    return [];
  }

  const data = await res.json();

  // Process each game
  const games = data.map((game: any) => {
    const bookmakers = game.bookmakers ?? [];

    // collect best prices
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

    // compute arbitrage
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
