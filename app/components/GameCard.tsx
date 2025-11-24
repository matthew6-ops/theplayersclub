"use client";

import { useMemo, useState } from "react";

type GameCardProps = {
  game: any;
};

// Convert decimal odds → American (+150 / -120 etc.)
function decimalToAmerican(decimal: number | null | undefined): string {
  if (!decimal || decimal <= 1) return "-";

  if (decimal >= 2) {
    return `+${Math.round((decimal - 1) * 100)}`;
  } else {
    return `${Math.round(-100 / (decimal - 1))}`;
  }
}

// Best price per team across all books
function getBestPrices(bookmakers: any[]): Record<string, number> {
  const best: Record<string, number> = {};

  bookmakers?.forEach((bm) => {
    bm.markets?.forEach((m: any) => {
      if (m.key !== "h2h") return;

      m.outcomes?.forEach((o: any) => {
        if (!best[o.name] || o.price > best[o.name]) {
          best[o.name] = o.price;
        }
      });
    });
  });

  return best;
}

function findH2HPrices(bookmaker: any, teams: string[]) {
  const market = bookmaker.markets?.find((m: any) => m.key === "h2h");
  const out: Record<string, number | null> = {};
  teams.forEach((t) => {
    const o = market?.outcomes?.find((o: any) => o.name === t);
    out[t] = o?.price ?? null;
  });
  return out;
}

export default function GameCard({ game }: GameCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [bankroll, setBankroll] = useState<number>(100);

  const home = game.home_team;
  const away = game.away_team;

  const commence = game.commence_time ? new Date(game.commence_time) : null;
  const now = new Date();
  const isLive = Array.isArray(game.scores) && game.scores.length > 0;
  const hasStarted = commence && commence < now;

  const bestPrices = useMemo(
    () => getBestPrices(game.bookmakers ?? []),
    [game.bookmakers]
  );

  const homeBest = bestPrices[home];
  const awayBest = bestPrices[away];

  // Expected value & arb info – adjust to your backend shape
  const evEdgePct: number = game.bestEv?.edge ?? 0; // e.g. 3.4 = +3.4%
  const arbRoi: number = game.bestArb?.roi ?? 0; // e.g. 0.032 = 3.2%

  const effectiveEdgePct =
    evEdgePct || (arbRoi ? arbRoi * 100 : 0);

  // Dumb but practical staking rules:
  // positive edge → 2% of bankroll, otherwise 1%
  const recommendedStake = bankroll * (effectiveEdgePct > 0 ? 0.02 : 0.01);
  const expectedProfit = (recommendedStake * effectiveEdgePct) / 100;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-lg shadow-emerald-500/5 transition hover:border-emerald-500/60 hover:shadow-emerald-500/20">
      {/* Arb banner */}
      {arbRoi > 0 && (
        <div className="mb-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-transparent px-3 py-1 text-xs font-medium text-emerald-300">
          Arbitrage detected · ROI {(arbRoi * 100).toFixed(2)}%
        </div>
      )}

      {/* Header: matchup & status */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">
            {game.sport_title ?? game.sport_key}
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-50">
            {away} @ {home}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            {commence && (
              <span>
                {commence.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                ·{" "}
                {commence.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            )}

            {isLive && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-400">
                Live
              </span>
            )}

            {!isLive && hasStarted && (
              <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold text-orange-400">
                In progress
              </span>
            )}

            {game.bookmakers?.[0]?.last_update && (
              <span className="text-[11px] text-slate-500">
                Book data:{" "}
                {new Date(
                  game.bookmakers[0].last_update
                ).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Score block */}
        {(isLive || hasStarted) && (
          <div className="mt-2 flex flex-row items-center gap-3 rounded-xl bg-slate-900/70 px-3 py-2 text-sm sm:mt-0">
            {game.scores?.map((s: any) => (
              <div key={s.name} className="flex flex-col items-center">
                <span className="text-[11px] uppercase tracking-wide text-slate-400">
                  {s.name}
                </span>
                <span className="text-lg font-semibold text-slate-50">
                  {s.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Best lines strip */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:text-sm">
        <div className="rounded-xl bg-slate-900/80 p-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Best line · {away}
          </div>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-base font-semibold text-slate-50">
              {decimalToAmerican(awayBest)}
            </span>
            <span className="text-[11px] text-slate-500">
              {awayBest ? awayBest.toFixed(2) : "-"}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Best line · {home}
          </div>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-base font-semibold text-slate-50">
              {decimalToAmerican(homeBest)}
            </span>
            <span className="text-[11px] text-slate-500">
              {homeBest ? homeBest.toFixed(2) : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* EV strip */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        {effectiveEdgePct !== 0 && (
          <span
            className={`rounded-full px-3 py-1 font-medium ${
              effectiveEdgePct > 0
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-red-500/10 text-red-300"
            }`}
          >
            Edge {effectiveEdgePct > 0 ? "+" : ""}
            {effectiveEdgePct.toFixed(2)}%
          </span>
        )}

        {game.market_type && (
          <span className="rounded-full bg-slate-900/90 px-3 py-1 text-slate-400">
            {game.market_type}
          </span>
        )}

        {game.label && (
          <span className="rounded-full bg-slate-900/90 px-3 py-1 text-slate-300">
            {game.label}
          </span>
        )}
      </div>

      {/* Expand toggle */}
      <button
        type="button"
        onClick={() => setExpanded((x) => !x)}
        className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-900"
      >
        <span>View books, lines & bet sizing</span>
        <span className="text-[11px] text-slate-500">
          {expanded ? "Hide" : "Expand"}
        </span>
      </button>

      {/* Expanded content: odds table + bankroll sim */}
      {expanded && (
        <div className="mt-4 space-y-4 border-t border-slate-800 pt-4">
          {/* Odds table */}
          <div className="max-h-64 overflow-y-auto pr-1">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-950/95">
                <tr className="text-[11px] text-slate-400">
                  <th className="px-2 py-1 text-left font-medium">Book</th>
                  <th className="px-2 py-1 text-right font-medium">
                    {away} (US / Dec)
                  </th>
                  <th className="px-2 py-1 text-right font-medium">
                    {home} (US / Dec)
                  </th>
                  <th className="px-2 py-1 text-right font-medium">
                    Last update
                  </th>
                </tr>
              </thead>
              <tbody>
                {game.bookmakers?.map((bm: any) => {
                  const prices = findH2HPrices(bm, [away, home]);
                  return (
                    <tr
                      key={bm.key}
                      className="border-t border-slate-900/60 text-slate-200"
                    >
                      <td className="px-2 py-1 text-left text-[11px] sm:text-xs">
                        {bm.title ?? bm.key}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {prices[away] ? (
                          <div className="flex flex-col items-end">
                            <span className="font-medium">
                              {decimalToAmerican(prices[away])}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {prices[away]?.toFixed(3)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {prices[home] ? (
                          <div className="flex flex-col items-end">
                            <span className="font-medium">
                              {decimalToAmerican(prices[home])}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {prices[home]?.toFixed(3)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="px-2 py-1 text-right text-[11px] text-slate-500">
                        {bm.last_update
                          ? new Date(bm.last_update).toLocaleTimeString(
                              undefined,
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bankroll / bet simulator */}
          <div className="rounded-xl bg-slate-900/80 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-slate-200">
                  Bankroll simulator
                </div>
                <div className="text-[11px] text-slate-500">
                  Simple stake sizing from edge / ROI
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">$</span>
                <input
                  type="number"
                  min={0}
                  value={bankroll}
                  onChange={(e) =>
                    setBankroll(Number(e.target.value) || 0)
                  }
                  className="w-24 rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1 text-right text-xs text-slate-100 outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-500">
                  bankroll
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-950/80 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                  Recommended stake
                </div>
                <div className="mt-1 text-sm font-semibold text-emerald-300">
                  ${recommendedStake.toFixed(2)}
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/80 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                  Expected profit
                </div>
                <div
                  className={`mt-1 text-sm font-semibold ${
                    expectedProfit >= 0
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  ${expectedProfit.toFixed(2)}
                </div>
              </div>
            </div>

            {arbRoi > 0 && (
              <div className="mt-2 text-[11px] text-slate-500">
                For pure arb, you can replace this with precise split
                stakes from your backend once you wire those fields in.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
