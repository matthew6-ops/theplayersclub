type Bookmaker = {
  title?: string;
  key?: string;
  markets?: { key: string; outcomes?: { name: string; price: number }[] }[];
};

type LineInfo = {
  price: number;
  bookmaker: string;
};

export function decimalToAmerican(decimal?: number | null) {
  if (!decimal || decimal <= 1) return "-";
  if (decimal >= 2) return `+${Math.round((decimal - 1) * 100)}`;
  return `${Math.round(-100 / (decimal - 1))}`;
}

export function buildBestLines(
  bookmakers: Bookmaker[] = [],
  outcomes: string[],
  marketKey = "h2h"
) {
  const best: Record<string, LineInfo | null> = {};
  outcomes.forEach((team) => {
    best[team] = null;
  });

  bookmakers?.forEach((bm) => {
    const market = bm?.markets?.find?.((m) => m?.key === marketKey);
    market?.outcomes?.forEach((o) => {
      if (!o?.name || typeof o.price !== "number") return;
      if (!best.hasOwnProperty(o.name)) return;
      if (!best[o.name] || o.price > (best[o.name]?.price ?? 0)) {
        best[o.name] = {
          price: o.price,
          bookmaker: bm?.title ?? bm?.key ?? "Book"
        };
      }
    });
  });

  return best;
}

export function computeFairProbabilities(best: Record<string, number>) {
  const entries = Object.entries(best).filter(([, price]) => price > 0);
  const implied = entries.map(([team, price]) => [team, 1 / price] as const);
  const total = implied.reduce((sum, [, p]) => sum + p, 0);
  if (!total) return {} as Record<string, number>;
  return implied.reduce((acc, [team, imp]) => {
    acc[team] = imp / total;
    return acc;
  }, {} as Record<string, number>);
}

export function calcEvPercent(fairProb: number | undefined, decimalOdds: number | undefined) {
  if (!fairProb || !decimalOdds) return null;
  const ev = fairProb * (decimalOdds - 1) - (1 - fairProb);
  return ev * 100;
}

export function calcArbBreakdown(best: Record<string, number>, stake: number) {
  const teams = Object.keys(best);
  if (teams.length !== 2) return null;
  const [teamA, teamB] = teams;
  const priceA = best[teamA];
  const priceB = best[teamB];
  if (!priceA || !priceB) return null;

  const invA = 1 / priceA;
  const invB = 1 / priceB;
  const sum = invA + invB;
  if (sum >= 1) return null;

  const stakeA = (stake * invA) / sum;
  const stakeB = (stake * invB) / sum;
  const profitPercent = (1 - sum) * 100;

  return {
    profitPercent,
    stakes: {
      [teamA]: stakeA,
      [teamB]: stakeB,
    },
  } as const;
}
