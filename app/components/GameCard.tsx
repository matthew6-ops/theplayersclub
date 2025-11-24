"use client";

import { useMemo, useState } from "react";

type GameCardProps = {
  game: any;
};

function formatTime(commence: string | undefined) {
  if (!commence) return "TBD";
  const dt = new Date(commence);
  if (Number.isNaN(dt.getTime())) return commence;
  return dt.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function GameCard({ game }: GameCardProps) {
  const [expanded, setExpanded] = useState(false);

  const bestPrices = useMemo(() => {
    const best: Record<string, number> = {};
    const bookmakers = game?.bookmakers ?? [];

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
  }, [game]);

  const home = game?.home_team ?? "Home";
  const away = game?.away_team ?? "Away";

  return (
    <article className="group rounded-2xl border border-slate-800 bg-gradient-to-br from-[#11111a] via-[#090914] to-[#050509] p-4 shadow-lg shadow-emerald-500/5 transition hover:-translate-y-0.5 hover:border-emerald-500/60 hover:shadow-emerald-500/20">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            {game?.sport_title ?? game?.sport_key ?? "Matchup"}
          </p>
          <h3 className="mt-1 text-sm font-semibold sm:text-base">
            <span className="text-slate-50">{home}</span>
            <span className="mx-1 text-slate-500">@</span>
            <span className="text-slate-50">{away}</span>
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Start: {formatTime(game?.commence_time)}
          </p>
        </div>

        {/* Small EV/flag stub for future use */}
        <div className="flex flex-col items-end gap-1">
          {game?.edge && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
              +EV {game.edge.toFixed?.(1)}%
            </span>
          )}
          {game?.is_arb && (
            <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[11px] font-semibold text-violet-300">
              ARB FOUND
            </span>
          )}
        </div>
      </header>

      {/* Best lines row */}
      <section className="mt-3 rounded-xl border border-slate-800 bg-[#090912] p-3 text-xs sm:text-[13px]">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Best Moneyline
        </p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-slate-400">Home</span>
            <span className="font-semibold text-emerald-400">
              {bestPrices[home] ? bestPrices[home].toFixed(2) : "-"}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-slate-400">Away</span>
            <span className="font-semibold text-cyan-300">
              {bestPrices[away] ? bestPrices[away].toFixed(2) : "-"}
            </span>
          </div>
        </div>
      </section>

      {/* Expand button */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-3 inline-flex w-full items-center justify-between rounded-xl border border-slate-800 bg-[#050509] px-3 py-2 text-xs font-medium text-slate-300 hover:border-emerald-500/60 hover:bg-[#070711]"
      >
        <span>{expanded ? "Hide full board" : "View full book breakdown"}</span>
        <span className="text-[10px] text-slate-500">
          {game?.bookmakers?.length ?? 0} books
        </span>
      </button>

      {/* Expanded odds table */}
      {expanded && (
        <section className="mt-3 space-y-2 rounded-xl bg-[#050509] p-3 text-xs">
          {(game?.bookmakers ?? []).map((bm: any, idx: number) => (
            <div
              key={bm?.key ?? idx}
              className="flex flex-col gap-1 rounded-lg border border-slate-900 bg-[#090912] px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">
                  {bm?.title ?? bm?.key ?? "Book"}
                </span>
                {bm?.last_update && (
                  <span className="text-[10px] text-slate-500">
                    {new Date(bm.last_update).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-[11px] text-slate-300">
                {(bm?.markets?.[0]?.outcomes ?? []).map(
                  (o: any, i: number) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-slate-400">{o?.name}</span>
                      <span className="font-semibold">
                        {typeof o?.price === "number" ? o.price : "-"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </article>
  );
}
