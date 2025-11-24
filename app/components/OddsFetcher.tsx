"use client";

import { useEffect, useState } from "react";
import OddsList from "./OddsList";

type Sport = "nba" | "nfl" | "nhl";

type OddsFetcherProps = {
  sport: Sport;
};

export default function OddsFetcher({ sport }: OddsFetcherProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function loadOdds(force = false) {
    try {
      setLoading(true);
      setError(null);

      const url = force
        ? `/api/odds?sport=${sport}&force=1`
        : `/api/odds?sport=${sport}`;

      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Unknown error");
        return;
      }

      setData(json);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOdds();
  }, [sport]);

  return (
    <div className="space-y-3">
      {/* Top row: meta + refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-neutral-400">
        <div>
          <span className="uppercase tracking-wide text-neutral-500">
            Selected sport:
          </span>{" "}
          <span className="font-semibold text-neutral-100">{sport}</span>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span>
              Updated{" "}
              <span className="text-neutral-200">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </span>
          )}

          <button
            type="button"
            onClick={() => loadOdds(true)}
            disabled={loading}
            className={[
              "px-3 py-1 rounded-full border text-xs font-medium",
              "border-neutral-700 text-neutral-100 hover:bg-neutral-800",
              loading ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {loading ? "Refreshing…" : "Refresh odds"}
          </button>
        </div>
      </div>

      {/* Status + table */}
      {loading && (
        <p className="text-sm text-neutral-400 mt-1">
          Loading live odds from books…
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400 mt-1">
          Error fetching odds: {error}
        </p>
      )}

      {!loading && !error && data && (
        <OddsList results={data?.odds ?? []} />
      )}
    </div>
  );
}
