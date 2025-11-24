"use client";

import { useState } from "react";
import SportTabs from "./components/SportTabs";
import OddsFetcher from "./components/OddsFetcher";

export default function HomePage() {
  const [sport, setSport] = useState<"nba" | "nfl" | "nhl">("nba");

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            The Players Club
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Live odds, arbitrage &amp; +EV scanner
          </p>
        </div>

        <div className="hidden sm:flex flex-col items-end text-xs text-neutral-400">
          <span className="uppercase tracking-wide">Paper bankroll</span>
          <span className="text-lg font-semibold text-emerald-400">
            $10,000
          </span>
        </div>
      </header>

      {/* Main card */}
      <section className="mt-2 rounded-xl border border-neutral-800 bg-neutral-900/70 shadow-lg overflow-hidden">
        {/* Card header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-neutral-800">
          <div>
            <h2 className="text-sm font-semibold text-neutral-100">
              Odds Dashboard
            </h2>
            <p className="text-xs text-neutral-400">
              Switch sports to update the board in real-time.
            </p>
          </div>

          <SportTabs selected={sport} onChange={setSport} />
        </div>

        {/* Card body */}
        <div className="px-4 py-4">
          <OddsFetcher sport={sport} />
        </div>
      </section>
    </div>
  );
}
