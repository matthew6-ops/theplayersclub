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
    <div>
      <div className="dashboard-panel">
        <div>
          <small>Live board</small>
          <h2>Arbitrage Radar</h2>
          <p>Scan every book for two-way edges and instantly size simulated stakes.</p>
        </div>
        <div style={{ marginTop: "18px", fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>
          {lastUpdated && <p>Updated {lastUpdated.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" })}</p>}
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>Auto refresh in {secondsToRefresh}s</p>
        </div>
      </div>

      {/* Sport tabs */}
      <SportTabs activeSport={activeSport} onChange={(sport) => setActiveSport(sport)} sports={sports} />

      {/* Content */}
      {filteredResults.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-[#2f273d] bg-[#120f19] px-6 py-8 text-center text-sm text-white/60">
          No opportunities right now. Either the books are sharp, or your
          scraper is asleep.
        </div>
      ) : (
        <OddsList results={filteredResults} />
      )}
    </div>
  );
}
