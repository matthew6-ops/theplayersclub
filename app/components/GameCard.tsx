"use client";

import { useMemo } from "react";

type GameCardProps = {
  game: any;
};

type LineInfo = {
  price: number;
  bookmaker: string;
};

const STAKE_UNIT = 100;

function formatTime(commence: string | undefined) {
  if (!commence) return "TBD";
  const dt = new Date(commence);
  if (Number.isNaN(dt.getTime())) return commence;
  return dt.toLocaleString(undefined, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  });
}

function decimalToAmerican(decimal?: number | null) {
  if (!decimal || decimal <= 1) return "-";
  if (decimal >= 2) return `+${Math.round((decimal - 1) * 100)}`;
  return `${Math.round(-100 / (decimal - 1))}`;
}

function buildBestLines(bookmakers: any[], teams: string[]): Record<string, LineInfo | null> {
  const best: Record<string, LineInfo | null> = {};
  teams.forEach((t) => (best[t] = null));

  bookmakers?.forEach((bm: any) => {
    const h2h = bm?.markets?.find?.((m: any) => m?.key === "h2h");
    h2h?.outcomes?.forEach((o: any) => {
      if (!o?.name || typeof o.price !== "number") return;
      if (!teams.includes(o.name)) return;
      if (!best[o.name] || o.price > (best[o.name]?.price ?? 0)) {
        best[o.name] = {
          price: o.price,
          bookmaker: bm?.title ?? bm?.key ?? "Book",
        };
      }
    });
  });

  return best;
}

function computeFairProbabilities(best: Record<string, number>) {
  const entries = Object.entries(best).filter(([, price]) => price > 0);
  const implied = entries.map(([team, price]) => [team, 1 / price] as const);
  const total = implied.reduce((sum, [, p]) => sum + p, 0);
  if (!total) return {} as Record<string, number>;
  return implied.reduce((acc, [team, imp]) => {
    acc[team] = imp / total;
    return acc;
  }, {} as Record<string, number>);
}

function calcEvPercent(fairProb: number | undefined, decimalOdds: number | undefined) {
  if (!fairProb || !decimalOdds) return null;
  const ev = fairProb * (decimalOdds - 1) - (1 - fairProb);
  return ev * 100;
}

function calcArbBreakdown(best: Record<string, number>, stake: number) {
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

export default function GameCard({ game }: GameCardProps) {
  const home = game?.home_team ?? "Home";
  const away = game?.away_team ?? "Away";
  const bookmakers = game?.bookmakers ?? [];
  const bookCount = bookmakers.length;

  const bestPrices = useMemo(() => {
    const best: Record<string, number> = {};
    bookmakers.forEach((bm: any) => {
      bm.markets?.forEach((m: any) => {
        if (m.key !== "h2h") return;
        m.outcomes?.forEach((o: any) => {
          if (!o?.name || typeof o.price !== "number") return;
          if (!best[o.name] || o.price > best[o.name]) {
            best[o.name] = o.price;
          }
        });
      });
    });
    return best;
  }, [bookmakers]);

  const bestLines = useMemo(() => buildBestLines(bookmakers, [home, away]), [bookmakers, home, away]);
  const fair = useMemo(() => computeFairProbabilities(bestPrices), [bestPrices]);

  const homeEv = calcEvPercent(fair[home], bestLines[home]?.price ?? undefined);
  const awayEv = calcEvPercent(fair[away], bestLines[away]?.price ?? undefined);
  const evPercent = Math.max(homeEv ?? -Infinity, awayEv ?? -Infinity);

  const arb = useMemo(() => calcArbBreakdown(bestPrices, STAKE_UNIT), [bestPrices]);
  const arbPercent = arb?.profitPercent ?? null;
  const guaranteedProfit = arbPercent ? (STAKE_UNIT * arbPercent) / 100 : null;

  const lines = [away, home]
    .map((team) => {
      const line = bestLines[team];
      if (!line) return null;
      const stake = arb?.stakes?.[team];
      return {
        team,
        bookmaker: line.bookmaker,
        price: line.price,
        american: decimalToAmerican(line.price),
        stake: stake ?? null,
      };
    })
    .filter(Boolean) as Array<{
      team: string;
      bookmaker: string;
      price: number;
      american: string;
      stake: number | null;
    }>;

  return (
    <article className="opportunity-card">
      <header style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <small style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.3em" }}>
            {(game?.sport_title ?? game?.sport_key ?? "Matchup").toUpperCase()}
          </small>
          <h3>
            {away} @ {home}
          </h3>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{formatTime(game?.commence_time)}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="opportunity-card__badge">ARB + EV</div>
          <div style={{ fontSize: "10px", letterSpacing: "0.3em", marginTop: "10px", color: "rgba(255,255,255,0.4)" }}>
            {bookCount} BOOKS
          </div>
        </div>
      </header>

      <div className="opportunity-card__metrics">
        <div>
          EV %<strong>{Number.isFinite(evPercent) ? `${evPercent!.toFixed(2)}%` : "--"}</strong>
        </div>
        <div>
          ARB %<strong>{arbPercent ? `${arbPercent.toFixed(2)}%` : "--"}</strong>
        </div>
        <div>
          Guaranteed profit<strong>{guaranteedProfit ? `$${guaranteedProfit.toFixed(2)}` : "--"}</strong>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)" }}>Simulated @ ${STAKE_UNIT}</span>
        </div>
        <div>
          Stake<strong>${STAKE_UNIT.toFixed(0)}.00</strong>
        </div>
      </div>

      <div className="opportunity-card__lines">
        {lines.map((line) => (
          <div key={line.team} className="line-pill">
            {line.team} @ {line.american}
            <span>
              {line.bookmaker} · Stake {line.stake ? `$${line.stake.toFixed(2)}` : "--"}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
