"use client";

type OddsListProps = {
  data: any;
};

// Convert decimal odds → American (+150)
function decimalToAmerican(decimal: number): string {
  if (!decimal || decimal <= 1) return "-";

  if (decimal >= 2) {
    return `+${Math.round((decimal - 1) * 100)}`;
  } else {
    return `${Math.round(-100 / (decimal - 1))}`;
  }
}

// Return best price for each outcome across all books
function getBestPrices(bookmakers: any[]) {
  const best: Record<string, number> = {};

  bookmakers.forEach((bm) => {
    bm.markets?.forEach((m: any) => {
      if (m.key !== "h2h") return;

      m.outcomes?.forEach((o: any) => {
        if (!best[o.name] || o.price > best[o.name]) {
          best[o.name] = o.price;
        }
      });
    });
  });

  return best;
}

// Detect arbitrage
function detectArbitrage(best: Record<string, number>) {
  const teams = Object.keys(best);
  if (teams.length !== 2) return null;

  const a = best[teams[0]];
  const b = best[teams[1]];

  const impliedA = 1 / a;
  const impliedB = 1 / b;

  const sum = impliedA + impliedB;

  if (sum < 1) {
    const profit = (1 - sum) * 100;
    return { exists: true, profit };
  }

  return { exists: false, profit: 0 };
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

            {/* Arbitrage Notice */}
            {arb && arb.exists && typeof arb.profit === "number" && arb.profit > 0 && (
              <div className="p-2 mb-3 bg-green-700 text-white font-bold rounded">
                Arbitrage Opportunity (+{arb.profit.toFixed(2)}%)
              </div>
            )}

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

                  const awayOutcome = h2h?.outcomes?.find(
                    (o: any) => o.name === away
                  );
                  const homeOutcome = h2h?.outcomes?.find(
                    (o: any) => o.name === home
                  );

                  const awayBest = best[away];
                  const homeBest = best[home];

                  return (
                    <tr key={bm.key} className="border-b border-neutral-800">
                      <td className="py-2">{bm.title}</td>

                      {/* Away Price (American format) */}
                      <td
                        className={
                          awayOutcome?.price === awayBest
                            ? "text-green-400 font-bold"
                            : ""
                        }
                      >
                        {awayOutcome
                          ? decimalToAmerican(awayOutcome.price)
                          : "-"}
                      </td>

                      {/* Home Price (American format) */}
                      <td
                        className={
                          homeOutcome?.price === homeBest
                            ? "text-green-400 font-bold"
                            : ""
                        }
                      >
                        {homeOutcome
                          ? decimalToAmerican(homeOutcome.price)
                          : "-"}
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
