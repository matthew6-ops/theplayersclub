"use client";

type OddsListProps = {
  data: any;
};

// -----------------------------
// Extract best prices per team
// -----------------------------
function getBestPrices(bookmakers: any[]) {
  const best: Record<string, number> = {};

  bookmakers.forEach((bm) => {
    bm.markets?.forEach((m: any) => {
      m.outcomes?.forEach((o: any) => {
        if (!best[o.name] || o.price > best[o.name]) {
          best[o.name] = o.price;
        }
      });
    });
  });

  return best;
}

// -----------------------------
// Detect simple 2-way arbitrage
// -----------------------------
function detectArbitrage(best: Record<string, number>) {
  const teams = Object.keys(best);
  if (teams.length !== 2) return null;

  const priceA = best[teams[0]];
  const priceB = best[teams[1]];

  if (!priceA || !priceB) return null;

  const impliedA = 1 / priceA;
  const impliedB = 1 / priceB;

  const sum = impliedA + impliedB;

  if (sum < 1) {
    const profit = (1 - sum) * 100;
    return { exists: true, profit };
  }

  return { exists: false };
}

// -----------------------------
// Main odds list component
// -----------------------------
export default function OddsList({ data }: OddsListProps) {
  const games = data?.odds || [];

  if (!games.length)
    return <p className="text-neutral-400 mt-4">No games found.</p>;

  return (
    <div className="mt-6 space-y-10">
      {games.map((game: any) => {
        const home = game.home_team;
        const away = game.away_team;

        const best = getBestPrices(game.bookmakers);
        const arb = detectArbitrage(best);

        return (
          <div
            key={game.id}
            className="p-5 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-bold mb-3 text-white">
              {away} @ {home}
            </h3>

            {/* Arbitrage Banner */}
            {arb?.exists === true && (
  <div className="p-3 mb-4 bg-green-700 text-white font-semibold rounded-lg">
    Arbitrage Opportunity Detected (+{(arb.profit ?? 0).toFixed(2)}% profit)
  </div>
)}


            {/* Odds Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-700 text-left text-neutral-300">
                    <th className="py-2 w-40">Bookmaker</th>
                    <th className="py-2">{away}</th>
                    <th className="py-2">{home}</th>
                  </tr>
                </thead>

                <tbody>
                  {game.bookmakers.map((bm: any) => {
                    const h2h = bm.markets.find((m: any) => m.key === "h2h");

                    const awayOutcome = h2h?.outcomes?.find(
                      (o: any) => o.name === away
                    );

                    const homeOutcome = h2h?.outcomes?.find(
                      (o: any) => o.name === home
                    );

                    return (
                      <tr
                        key={bm.key}
                        className="border-b border-neutral-800 text-white"
                      >
                        <td className="py-2 font-medium text-neutral-300">
                          {bm.title}
                        </td>

                        {/* Away */}
                        <td
                          className={`py-2 ${
                            awayOutcome?.price === best[away]
                              ? "text-green-400 font-bold"
                              : ""
                          }`}
                        >
                          {awayOutcome?.price ?? "-"}
                        </td>

                        {/* Home */}
                        <td
                          className={`py-2 ${
                            homeOutcome?.price === best[home]
                              ? "text-green-400 font-bold"
                              : ""
                          }`}
                        >
                          {homeOutcome?.price ?? "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
