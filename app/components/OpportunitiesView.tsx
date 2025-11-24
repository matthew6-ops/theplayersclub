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
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5/0 bg-gradient-to-br from-white/4 via-white/2 to-transparent px-5 py-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
            Live Trading Desk
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Arbitrage &amp; EV Opportunities
          </h2>
          <p className="text-sm text-white/60">
            Filter by sport, monitor real-time edges, and size your simulated stakes.
          </p>
        </div>

        <div className="flex flex-col items-start text-xs text-white/65 sm:items-end">
          {lastUpdated && (
            <span className="text-sm font-medium text-amber-200">
              Updated{" "}
              {lastUpdated.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          )}
          <span className="text-[11px] text-white/45">
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
        <div className="mt-4 rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-8 text-center text-sm text-white/60">
          No opportunities right now. Either the books are sharp, or your
          scraper is asleep.
        </div>
      ) : (
        <OddsList results={filteredResults} />
      )}
    </div>
  );
}
