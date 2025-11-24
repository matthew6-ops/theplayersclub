"use client";

type OddsListProps = {
  data: any;
};

// Convert decimal odds → American
function decimalToAmerican(decimal: number | null | undefined): string {
  if (!decimal || decimal <= 1) return "-";

  if (decimal >= 2) {
    return `+${Math.round((decimal - 1) * 100)}`;
  } else {
    return `${Math.round(-100 / (decimal - 1))}`;
  }
}

// Best price for each team across all books
function getBestPrices(bookmakers: any[]): Record<string, number> {
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

// Fair probabilities (remove vig)
function getFairProbabilities(best: Record<string, number>): Record<string, number> {
  const teams = Object.keys(best);
  if (teams.length !== 2) return {};

  const implied: Record<string, number> = {};
  let sum = 0;

  teams.forEach((team) => {
    const p = 1 / best[team];
    implied[team] = p;
    sum += p;
  });

  const fair: Record<string, number> = {};
  teams.forEach((team) => (fair[team] = implied[team] / sum));

  return fair;
}

// Arbitrage result type
type ArbResult =
  | { exists: false }
  | {
      exists: true;
      teamA: string;
      teamB: string;
      priceA: number;
      priceB: number;
      profitPercent: number;
      stakeA: number;
      stakeB: number;
    };

// Two-way arbitrage checker
function detectArbitrage(best: Record<string, number>): ArbResult {
  const teams = Object.keys(best);
  if (teams.length !== 2) return { exists: false };

  const [teamA, teamB] = teams;
  const priceA = best[teamA];
  const priceB = best[teamB];

  const invA = 1 / priceA;
  const invB = 1 / priceB;
  const sum = invA + invB;

  if (sum >= 1) return { exists: false };

  const bankroll = 100;

  const stakeA = (bankroll * priceB) / (priceA + priceB);
  const stakeB = (bankroll * priceA) / (priceA + priceB);

  const payout = stakeA * priceA;
  const profit = payout - bankroll;
  const profitPercent = (profit / bankroll) * 100;

  return {
    exists: true,
    teamA,
    teamB,
    priceA,
    priceB,
    profitPercent,
    stakeA,
    stakeB
  };
}

// EV calculator
function calcEvPercent(fairProb: number, decimalOdds: number): number {
  const ev = fairProb * (decimalOdds - 1) - (1 - fairProb);
  return ev * 100;
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
        const fair = getFairProbabilities(best);

        return (
          <div key={game.id} className="p-4 border border-neutral-700 rounded-lg bg-black/40">
            <h3 className="text-lg font-bold mb-2">
              {away} @ {home}
            </h3>

            {/* Arbitrage Banner */}
            {arb.exists && (
              <div className="p-3 mb-4 rounded-md bg-emerald-900/70 text-emerald-50 text-sm">
                <div className="font-semibold">
                  Arbitrage Opportunity: +{arb.profitPercent.toFixed(2)}% guaranteed
                </div>
                <div className="mt-1 text-xs text-emerald-200/80">
                  Example using $100:
                  <br />• Bet ${arb.stakeA.toFixed(2)} on <b>{arb.teamA}</b> @ {arb.priceA.toFixed(2)}
                  <br />• Bet ${arb.stakeB.toFixed(2)} on <b>{arb.teamB}</b> @ {arb.priceB.toFixed(2)}
                </div>
              </div>
            )}

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-700 text-left">
                  <th className="py-2 pr-2">Bookmaker</th>
                  <th className="py-2 pr-2">{away}</th>
                  <th className="py-2 pr-2">{home}</th>
                </tr>
              </thead>

              <tbody>
                {game.bookmakers.map((bm: any) => {
                  const h2h = bm.markets?.find((m: any) => m.key === "h2h");

                  const awayOutcome = h2h?.outcomes?.find((o: any) => o.name === away);
                  const homeOutcome = h2h?.outcomes?.find((o: any) => o.name === home);

                  const awayBest = best[away];
                  const homeBest = best[home];

                  const awayFairProb = fair[away];
                  const homeFairProb = fair[home];

                  const awayEv =
                    awayOutcome && awayFairProb
                      ? calcEvPercent(awayFairProb, awayOutcome.price)
                      : null;

                  const homeEv =
                    homeOutcome && homeFairProb
                      ? calcEvPercent(homeFairProb, homeOutcome.price)
                      : null;

                  const awayIsBest = !!awayOutcome && awayOutcome.price === awayBest;
                  const homeIsBest = !!homeOutcome && homeOutcome.price === homeBest;

                  const awayIsPlusEv = awayEv !== null && awayEv > 0;
                  const homeIsPlusEv = homeEv !== null && homeEv > 0;

                  return (
                    <tr key={bm.key} className="border-b border-neutral-800">
                      <td className="py-2 pr-2">{bm.title}</td>

                      {/* Away Price (+EV + Best Line Highlighting) */}
                      <td
                        className={
                          "py-2 pr-2" +
                          (awayIsBest ? " text-green-400 font-bold" : "") +
                          (awayIsPlusEv ? " bg-emerald-900/30" : "")
                        }
                      >
                        {awayOutcome ? (
                          <div className="flex flex-col">
                            <span>{decimalToAmerican(awayOutcome.price)}</span>
                            {awayIsPlusEv && (
                              <span className="text-xs text-emerald-300">
                                +{awayEv!.toFixed(1)}% EV
                              </span>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Home Price */}
                      <td
                        className={
                          "py-2 pr-2" +
                          (homeIsBest ? " text-green-400 font-bold" : "") +
                          (homeIsPlusEv ? " bg-emerald-900/30" : "")
                        }
                      >
                        {homeOutcome ? (
                          <div className="flex flex-col">
                            <span>{decimalToAmerican(homeOutcome.price)}</span>
                            {homeIsPlusEv && (
                              <span className="text-xs text-emerald-300">
                                +{homeEv!.toFixed(1)}% EV
                              </span>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
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
