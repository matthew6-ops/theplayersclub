"use client";

import { useMemo } from "react";
import {
  buildBestLines,
  calcArbBreakdown,
  calcEvPercent,
  computeFairProbabilities,
  decimalToAmerican,
} from "@/lib/oddsMath";

type GameCardProps = {
  game: any;
  stakeUnit: number;
  allowedBooks: string[];
};

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

export default function GameCard({ game, stakeUnit, allowedBooks }: GameCardProps) {
  const home = game?.home_team ?? "Home";
  const away = game?.away_team ?? "Away";
  const bookmakers = game?.bookmakers ?? [];
  const allowedSet = useMemo(() => {
    if (!allowedBooks?.length) return null;
    return new Set(allowedBooks);
  }, [allowedBooks]);

  const filteredBooks = useMemo(() => {
    if (!allowedSet) return bookmakers;
    return bookmakers.filter((bm: any) =>
      allowedSet.has(bm?.title ?? bm?.key ?? "")
    );
  }, [bookmakers, allowedSet]);
  const bookCount = filteredBooks.length || bookmakers.length;

  const bestPrices = useMemo(() => {
    const best: Record<string, number> = {};
    filteredBooks.forEach((bm: any) => {
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
  }, [filteredBooks]);

  const bestLines = useMemo(
    () => buildBestLines(filteredBooks, [home, away]),
    [filteredBooks, home, away]
  );
  const fair = useMemo(() => computeFairProbabilities(bestPrices), [bestPrices]);

  const homeEv = calcEvPercent(fair[home], bestLines[home]?.price ?? undefined);
  const awayEv = calcEvPercent(fair[away], bestLines[away]?.price ?? undefined);
  const evPercent = Math.max(homeEv ?? -Infinity, awayEv ?? -Infinity);

  const arb = useMemo(() => calcArbBreakdown(bestPrices, stakeUnit), [bestPrices, stakeUnit]);
  const arbPercent = arb?.profitPercent ?? null;
  const guaranteedProfit = arbPercent ? (stakeUnit * arbPercent) / 100 : null;

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
      <header className="opportunity-card__header">
        <div>
          <small className="opportunity-card__sport">
            {(game?.sport_title ?? game?.sport_key ?? "Matchup").toUpperCase()}
          </small>
          <h3>
            {away} @ {home}
          </h3>
          <p className="opportunity-card__time">{formatTime(game?.commence_time)}</p>
        </div>
        <div className="opportunity-card__badge-wrap">
          <div className="opportunity-card__badge">ARB + EV</div>
          <div className="opportunity-card__books">{bookCount} BOOKS</div>
        </div>
      </header>

      <div className="opportunity-card__metrics">
        <div>
          <span className="opportunity-card__metric-label">EV %</span>
          <strong>{Number.isFinite(evPercent) ? `${evPercent!.toFixed(2)}%` : "--"}</strong>
        </div>
        <div>
          <span className="opportunity-card__metric-label">Arb %</span>
          <strong>{arbPercent ? `${arbPercent.toFixed(2)}%` : "--"}</strong>
        </div>
        <div>
          <span className="opportunity-card__metric-label">Guaranteed profit</span>
          <strong>{guaranteedProfit ? `$${guaranteedProfit.toFixed(2)}` : "--"}</strong>
          <span className="opportunity-card__hint">Simulated @ ${stakeUnit}</span>
        </div>
        <div>
          <span className="opportunity-card__metric-label">Stake</span>
          <strong>${stakeUnit.toFixed(0)}.00</strong>
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
