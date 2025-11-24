"use client";

import { useEffect, useState } from "react";

type OddsFetcherProps = {
  sport: "nba" | "nfl" | "nhl";
};

export default function OddsFetcher({ sport }: OddsFetcherProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadOdds() {
    try {
      setLoading(true);
      setError(null);

     const res = await fetch(`/api/odds?sport=${sport}`);


      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Unknown error");
        return;
      }

      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOdds();
  }, [sport]);

  return (
    <div className="mt-6 p-4 border border-neutral-700 rounded-lg">
      <h2 className="text-xl font-bold mb-3">Live Odds</h2>

      {loading && <p className="text-neutral-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <pre className="text-sm bg-black p-4 rounded overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

      <button
        onClick={loadOdds}
        className="mt-4 px-4 py-2 bg-neutral-800 border border-neutral-600 rounded hover:bg-neutral-700"
      >
        Refresh Odds
      </button>
    </div>
  );
}
