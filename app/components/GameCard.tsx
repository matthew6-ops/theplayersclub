"use client";

import {
  buildBestLines,
  calcArbBreakdown,
  calcEvPercent,
  computeFairProbabilities,
  decimalToAmerican
} from "@/lib/oddsMath";

type Outcome = {
  name: string;
  price: number;
};

type Market = {
  key: string;
  outcomes?: Outcome[];
};

type Bookmaker = {
  title?: string;
  key?: string;
  markets?: Market[];
};

type Game = {
  id?: string;
  sport_key: string;
  sport_title?: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers?: Bookmaker[];
};

type GameCardProps = {
  game: Game;
  stakeUnit: number;
  allowedBooks: string[];
};

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatStartTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit"
  });

export default function GameCard({ game, stakeUnit, allowedBooks }: GameCardProps) {
  const home = game.home_team;
  const away = game.away_team;
  const allowedSet = allowedBooks.length ? new Set(allowedBooks) : null;

  const filteredBooks = (game.bookmakers ?? []).filter((bm) => {
    if (!allowedSet) return true;
    const label = bm.title ?? bm.key ?? "";
    return allowedSet.has(label);
  });

  const bestPrices: Record<string, number> = {};
  filteredBooks.forEach((bm) => {
    bm.markets?.forEach((market) => {
      if (market.key !== "h2h") return;
      market.outcomes?.forEach((outcome) => {
        if (!outcome?.name || typeof outcome.price !== "number") return;
        if (!bestPrices[outcome.name] || outcome.price > bestPrices[outcome.name]) {
          bestPrices[outcome.name] = outcome.price;
        }
      });
    });
  });

  const bestLines = buildBestLines(filteredBooks, [away, home]);
  const fair = computeFairProbabilities(bestPrices);
  const homeEv = calcEvPercent(fair[home], bestLines[home]?.price ?? undefined);
  const awayEv = calcEvPercent(fair[away], bestLines[away]?.price ?? undefined);
  const evPercent =
    [homeEv, awayEv].filter((val) => typeof val === "number").length > 0
      ? Math.max(homeEv ?? -Infinity, awayEv ?? -Infinity)
      : null;

  const arb = calcArbBreakdown(bestPrices, stakeUnit);
  const arbPercent = arb?.profitPercent ?? null;
  const guaranteedProfit =
    typeof arbPercent === "number" && arbPercent > 0
      ? (stakeUnit * arbPercent) / 100
      : null;
  const stakeEntries =
    typeof arbPercent === "number" && arbPercent > 0 && arb?.stakes
      ? Object.entries(arb.stakes)
      : [];

  const hasArb = typeof arbPercent === "number" && arbPercent > 0;
  const hasPositiveEv = typeof evPercent === "number" && evPercent > 0;
  const evColor = typeof evPercent === "number"
    ? evPercent >= 0
      ? "#86efac"
      : "#fda4af"
    : "#b8b3c7";

  const statusCopy = hasArb
    ? `Bet both sides as shown to lock in ${arbPercent?.toFixed(2)}% profit.`
    : hasPositiveEv
    ? "Positive EV detected but the books never cross for arbitrage."
    : "Market vig overwhelms the edge — this matchup is expected to lose over time.";

  const lines = [away, home]
    .map((team) => {
      const line = bestLines[team];
      if (!line?.price) return null;
      const simProfit = stakeUnit * (line.price - 1);
      return {
        team,
        american: decimalToAmerican(line.price),
        sportsbook: line.bookmaker ?? "Sportsbook",
        stake: arb?.stakes?.[team] ?? null,
        simProfit
      };
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const bookCount = filteredBooks.length || game.bookmakers?.length || 0;

  const badgeLabel = hasArb ? "ARB + EV" : hasPositiveEv ? "+EV" : "VALUE";

  return (
    <article className="opportunity-card">
      <header className="opportunity-card__header">
        <div>
          <p className="opportunity-card__sport">
            {(game.sport_title ?? game.sport_key).toUpperCase()}
          </p>
          <h3>
            {away} @ {home}
          </h3>
          <p className="opportunity-card__time">{formatStartTime(game.commence_time)}</p>
        </div>
        <div className="opportunity-card__badge-wrap">
          <div className="opportunity-card__badge">{badgeLabel}</div>
          <div className="opportunity-card__books">
            {bookCount} <br />
            BOOKS
          </div>
        </div>
      </header>

      <section className="opportunity-card__metrics">
        <div>
          <span className="opportunity-card__metric-label">EV %</span>
          <strong style={{ color: evColor }}>
            {typeof evPercent === "number" ? `${evPercent.toFixed(2)}%` : "n/a"}
          </strong>
        </div>
        <div>
          <span className="opportunity-card__metric-label">Arb %</span>
          <strong>{hasArb ? `${arbPercent?.toFixed(2)}%` : "n/a"}</strong>
        </div>
        <div>
          <span className="opportunity-card__metric-label">Guaranteed profit</span>
          <strong>
            {hasArb && guaranteedProfit ? formatMoney(guaranteedProfit) : "n/a"}
          </strong>
          <span className="opportunity-card__hint">
            Simulated @ {formatMoney(stakeUnit)}
          </span>
        </div>
        <div>
          <span className="opportunity-card__metric-label">Stake</span>
          <strong>{formatMoney(stakeUnit)}</strong>
        </div>
      </section>

      {hasArb && stakeEntries.length === 2 && (
        <section className="opportunity-card__lines">
          {stakeEntries.map(([team, stake]) => (
            <div key={team} className="line-pill">
              Stake on {team}
              <span>{formatMoney(stake)}</span>
            </div>
          ))}
        </section>
      )}

      <section className="opportunity-card__lines">
        {lines.map((line) => (
          <div key={line.team} className="line-pill">
            {line.team} @ {line.american}
            <span>
              {line.sportsbook} ·{" "}
              {line.stake ? `Stake ${formatMoney(line.stake)}` : "Stake flexible"}
            </span>
            <span className="line-pill__profit">
              Sim profit: {formatMoney(line.simProfit)}
            </span>
          </div>
        ))}
      </section>

      <p className="text-xs text-white/50">{statusCopy}</p>
    </article>
  );
}
