"use client";

type OddsListProps = {
  data: any;
};

// Return best price for each outcome across all books
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

// Detect arbitrage between the two sides
function detectArbitrage(best: Record<string, number>) {
  const teams = Object.keys(best);
  if (teams.length !== 2) return null;

  const a = best[teams[0]];
  const b = best[teams[1]];

  const impliedA = 1 / a;
  const impliedB = 1 / b;

  if (impliedA + impliedB < 1) {
    return {
      exists: true,
      profit: (1 - (impliedA + impliedB)) * 100
    };
  }

  return { exists: false };
}

export default function OddsList({ data }: OddsListProps) {
  const games = data?.odds || [];

  if (!games.length) return <p>No odds available.</p>;

  return (
    <div className="space-y-8">
      {games.map((game: any) => {
        const home = game.home_team;
        const away = game.away_team;

        const best = getBestPrices(game.bookmakers);
        const arb = detectArbitrage(best);

        return (
          <div key={game.id} className="p-4 border border-neutral-600 rounded">
            <h3 className="text-lg font-bold mb-2">
              {away} @ {home}
            </h3>

            {/* Arbitrage Alert */}
            {arb?.exists && (
              <div className="p-2 mb-3 bg-green-700 text-white font-bold rounded">
                Arbitrage Opportunity Detected (+{arb.profit.toFixed(2)}% Profit)
              </div>
            )}

            {/* Table */}
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700 text-left">
                  <th className="py-2">Bookmaker</th>
                  <th className="py-2">{away}</th>
                  <th className="py-2">{home}</th>
                </tr>
              </thead>

              <tbody>
                {game.bookmakers.map((bm: any) => {
                  const h2h = bm.markets.find((m: any) => m.key === "h2h");
                  const awayOutcome = h2h?.outcomes?.find((o: any) => o.name === away);
                  const homeOutcome = h2h?.outcomes?.find((o: any) => o.name === home);

                  return (
                    <tr key={bm.key} className="border-b border-neutral-800">
                      <td className="py-2">{bm.title}</td>

                      {/* Away price */}
                      <td
                        className={
                          awayOutcome?.price === best[away]
                            ? "text-green-400 font-bold"
                            : ""
                        }
                      >
                        {awayOutcome?.price ?? "-"}
                      </td>

                      {/* Home price */}
                      <td
                        className={
                          homeOutcome?.price === best[home]
                            ? "text-green-400 font-bold"
                            : ""
                        }
                      >
                        {homeOutcome?.price ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
