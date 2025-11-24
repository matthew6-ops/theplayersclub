"use client";

import { useEffect, useMemo, useState } from "react";
import SportTabs from "./SportTabs";
import OddsList from "./OddsList";

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;


  // derive sports from data
  const sports = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of results ?? []) {
      const key = g.sport_key ?? "unknown";
      const label = g.sport_title ?? key.toUpperCase();
      if (!map.has(key)) map.set(key, label);
    }
    return Array.from(map.entries()).map(([key, label]) => ({
      key,
      label,
    }));
  }, [results]);

  const filteredResults = useMemo(() => {
    if (activeSport === "all") return results;
    return (results ?? []).filter(
      (g: any) => g.sport_key === activeSport
    );
  }, [results, activeSport]);

  // auto-refresh loop
  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const res = await fetch(`${API_URL}/api/opportunities`);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) {
          setResults(json ?? []);
          setLastUpdated(new Date());
          setSecondsToRefresh(15);
        }
      } catch {
        // keep last good data, user doesn't need to see the API crying
      }
    }

    refresh();

    const refreshTimer = setInterval(refresh, 15000);
    const countdownTimer = setInterval(() => {
      setSecondsToRefresh((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(refreshTimer);
      clearInterval(countdownTimer);
    };
  }, [API_URL]);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            Odds Dashboard
          </h2>
          <p className="text-xs text-slate-400">
            Auto-refreshing crypto-style board. Filter by sport, scan edges,
            fire fake bullets.
          </p>
        </div>

        <div className="flex flex-col items-start text-xs text-slate-400 sm:items-end">
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
      <SportTabs
        activeSport={activeSport}
        onChange={(sport) => setActiveSport(sport)}
        sports={sports}
      />

      {/* Content */}
      {filteredResults.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-800 bg-[#050509] px-4 py-6 text-center text-sm text-slate-400">
          No opportunities right now. Either the books are sharp, or your
          scraper is asleep.
        </div>
      ) : (
        <OddsList results={filteredResults} />
      )}
    </div>
  );
}
