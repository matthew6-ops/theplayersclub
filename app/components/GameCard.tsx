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
    <article className="rounded-[26px] border border-white/8 bg-gradient-to-br from-[#1c1a24]/95 via-[#0d0c13]/95 to-[#050307]/95 p-5 text-sm shadow-[0_20px_45px_rgba(5,3,7,0.6)]">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">
            {game?.sport_title?.toUpperCase() ?? game?.sport_key ?? "Matchup"} · H2H
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            {away} @ {home}
          </h3>
          <p className="text-xs text-white/55">{formatTime(game?.commence_time)}</p>
        </div>
        <div className="rounded-full bg-gradient-to-r from-[#ffd36f] to-[#f0922c] px-3 py-1 text-[11px] font-semibold text-black shadow-md shadow-[#fbd384]/40">
          ARB + EV
        </div>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/65 sm:grid-cols-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">EV %</p>
          <p className="mt-1 text-base font-semibold text-amber-200">
            {Number.isFinite(evPercent) ? `${evPercent!.toFixed(2)}%` : "--"}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Arb %</p>
          <p className="mt-1 text-base font-semibold text-amber-200">
            {arbPercent ? `${arbPercent.toFixed(2)}%` : "--"}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Guaranteed profit</p>
          <p className="mt-1 text-base font-semibold text-white">
            {guaranteedProfit ? `$${guaranteedProfit.toFixed(2)}` : "--"}
          </p>
          <p className="text-[10px] text-white/40">Simulated @ ${STAKE_UNIT}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Stake</p>
          <p className="mt-1 text-base font-semibold text-white">
            ${STAKE_UNIT.toFixed(0)}.00
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {lines.map((line) => (
          <div
            key={line.team}
            className="rounded-2xl border border-white/5 bg-white/5/0 bg-gradient-to-r from-white/[0.06] to-transparent px-4 py-3 text-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-white">
                  {line.team} @ {line.american}
                </p>
                <p className="text-[11px] text-white/55">{line.bookmaker}</p>
              </div>
              <div className="text-right text-[12px] text-white/70">
                <p>Stake {line.stake ? `$${line.stake.toFixed(2)}` : "--"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
