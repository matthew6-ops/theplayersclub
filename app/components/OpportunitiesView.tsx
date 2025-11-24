"use client";

import { useEffect, useMemo, useState } from "react";
import GameCard from "./GameCard";

type OpportunitiesViewProps = {
  initialResults: any[];
};

export default function OpportunitiesView({
  initialResults,
}: OpportunitiesViewProps) {
  const [results, setResults] = useState<any[]>(initialResults ?? []);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialResults?.length ? new Date() : null
  );
  const [secondsToRefresh, setSecondsToRefresh] = useState(15);
  const [activeSport, setActiveSport] = useState<string>("all");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  // Auto-refresh & countdown
  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/opportunities`);
        if (!res.ok) return;

        const json = await res.json();
        if (!isCancelled) {
          setResults(json);
          setLastUpdated(new Date());
        }
      } catch {
        // silently eat errors, user can still see last good data
      }
    };

    // Initial refresh on mount
    fetchData();

    const refreshInterval = setInterval(() => {
      fetchData();
      setSecondsToRefresh(15);
    }, 15000);

    const countdownInterval = setInterval(() => {
      setSecondsToRefresh((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      isCancelled = true;
      clearInterval(refreshInterval);
      clearInterval(countdownInterval);
    };
  }, [API_URL]);

  // Collect sports for tabs
  const sports = useMemo(() => {
    const set = new Map<string, string>();
    results?.forEach((g: any) => {
      const key = g.sport_key ?? "unknown";
      const title = g.sport_title ?? key;
      if (!set.has(key)) set.set(key, title);
    });
    return Array.from(set.entries()).map(([key, label]) => ({
      key,
      label,
    }));
  }, [results]);

  const filteredGames = useMemo(() => {
    if (activeSport === "all") return results ?? [];
    return (results ?? []).filter(
      (g: any) => g.sport_key === activeSport
    );
  }, [results, activeSport]);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
            SharpEdge
          </div>
          <h1 className="mt-1 text-xl font-semibold text-slate-50 sm:text-2xl">
            Live arbitrage & EV opportunities
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Dark crypto-style board. Best lines, edge, and sizing in
            one place.
          </p>
        </div>

        <div className="flex flex-col items-start gap-1 text-xs text-slate-400 sm:items-end">
          {lastUpdated && (
            <span>
              Updated{" "}
              {lastUpdated.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          )}
          <span className="text-[11px] text-slate-500">
            Auto refresh in {secondsToRefresh}s
          </span>
        </div>
      </div>

      {/* Sport tabs */}
      <div className="sticky top-0 z-10 -mx-4 mb-2 bg-slate-950/95 px-4 pt-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveSport("all")}
            className={`rounded-full px-3 py-1.5 transition ${
              activeSport === "all"
                ? "bg-emerald-500 text-slate-950"
                : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
            }`}
          >
            All
          </button>
          {sports.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveSport(s.key)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${
                activeSport === s.key
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filteredGames.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-950/80 p-6 text-center text-sm text-slate-400">
          No opportunities at the moment. Either the books are sharp or
          your scraper is asleep.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredGames.map((game: any) => (
            <GameCard key={game.id ?? `${game.sport_key}-${game.home_team}-${game.away_team}-${game.commence_time}`} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
