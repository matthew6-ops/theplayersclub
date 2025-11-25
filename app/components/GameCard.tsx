"use client";

import { useMemo, useState } from "react";
import {
  buildBestLines,
  calcArbBreakdown,
  calcEvPercent,
  computeFairProbabilities,
  decimalToAmerican
} from "@/lib/oddsMath";
import { getMarketConfig } from "@/lib/marketConfig";

type Outcome = {
  name: string;
  price: number;
  point?: number;
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

type Scoreboard = {
  status?: string;
  in_progress?: boolean;
  completed?: boolean;
  period?: string | number;
  display_clock?: string;
  clock?: string;
  home_score?: number;
  away_score?: number;
  scores?: { name?: string; score?: number }[];
};

type Game = {
  id?: string;
  sport_key: string;
  sport_title?: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  bookmakers?: Bookmaker[];
  scoreboard?: Scoreboard;
};

type GameCardProps = {
  game: Game;
  stakeUnit: number;
  allowedBooks: string[];
  viewType?: "arb" | "ev";
  oddsDisplay?: "american" | "decimal";
  marketKey?: string;
};

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatStartTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit"
  });

const formatScoreboardStatus = (scoreboard?: Scoreboard) => {
  if (!scoreboard) return null;
  if (scoreboard.status) return scoreboard.status;
  if (scoreboard.completed) return "Final";
  if (scoreboard.in_progress) return "Live";
  return null;
};

const getTeamScore = (scoreboard: Scoreboard | undefined, teamName: string, fallback: "home" | "away") => {
  if (!scoreboard) return null;
  const fromArray = scoreboard.scores?.find((s) => s.name === teamName)?.score;
  if (typeof fromArray === "number") return fromArray;
  if (fallback === "home") return scoreboard.home_score ?? null;
  return scoreboard.away_score ?? null;
};

const formatPoint = (point?: number) => {
  if (point == null) return "";
  if (point > 0) return `+${point}`;
  return point.toString();
};

const formatBetLabel = (name: string, point: number | undefined, marketKey: string) => {
  if (marketKey === "spreads" || marketKey === "totals") {
    const pointStr = formatPoint(point);
    return pointStr ? `${name} ${pointStr}` : name;
  }
  return name;
};

export default function GameCard({
  game,
  stakeUnit,
  allowedBooks,
  viewType = "ev",
  oddsDisplay = "american",
  marketKey = "h2h"
}: GameCardProps) {
  const home = game.home_team;
  const away = game.away_team;
  const allowedSet = allowedBooks.length ? new Set(allowedBooks) : null;
  const [showAllBooks, setShowAllBooks] = useState(false);

  const filteredBooks = (game.bookmakers ?? []).filter((bm) => {
    if (!allowedSet) return true;
    const label = bm.title ?? bm.key ?? "";
    return allowedSet.has(label);
  });

  const marketConfig = getMarketConfig(marketKey);
  const outcomeLabels = marketConfig.outcomes(game);

  const bestLines = buildBestLines(filteredBooks, outcomeLabels, marketKey);
  const bestPrices: Record<string, number> = {};
  outcomeLabels.forEach((label) => {
    const info = bestLines[label];
    if (info?.price) {
      bestPrices[label] = info.price;
    }
  });
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
      ? "#36c98e"
      : "#f37575"
    : "#b8b3c7";

  const lines = outcomeLabels
    .map((team) => {
      const line = bestLines[team];
      if (!line?.price) return null;
      const stakeForTeam = arb?.stakes?.[team] ?? stakeUnit;
      const simProfit = stakeUnit * (line.price - 1);
      return {
        team,
        american: decimalToAmerican(line.price),
        decimal: line.price,
        sportsbook: line.bookmaker ?? "Sportsbook",
        point: line.point,
        stake: arb?.stakes?.[team] ?? null,
        highlightStake: stakeForTeam,
        simProfit
      };
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const bookCount = filteredBooks.length || game.bookmakers?.length || 0;

  const bookBreakdowns = filteredBooks.map((bm) => {
    const market = bm.markets?.find((m) => m.key === "h2h");
    return {
      title: bm.title ?? bm.key ?? "Sportsbook",
      outcomes:
        market?.outcomes?.map((outcome) => ({
          team: outcome.name,
          decimal: outcome.price,
          american: decimalToAmerican(outcome.price ?? 0),
          point: outcome.point
        })) ?? []
    };
  });

  const isArbCard = viewType === "arb";
  const isEvCard = viewType === "ev";

  if (isArbCard && !hasArb) {
    return null;
  }
  if (isEvCard && !hasPositiveEv) {
    return null;
  }

  const showArbDetails = isArbCard || (!viewType && hasArb);
  const showEvDetails = isEvCard || (!viewType && hasPositiveEv);

  const badgeLabel = showArbDetails ? "ARB" : showEvDetails ? "+EV" : "VALUE";
  const variantClass = showArbDetails
    ? "opportunity-card--arb"
    : showEvDetails
    ? "opportunity-card--ev"
    : "opportunity-card--value";

  const statusCopy = showArbDetails
    ? `Bet both sides as shown to lock in ${arbPercent?.toFixed(2)}% profit.`
    : showEvDetails
    ? "Positive EV detected but the books never cross for arbitrage."
    : "Market vig overwhelms the edge — this matchup is expected to lose over time.";

  const metrics: { label: string; value: string; highlight?: string; sub?: string }[] = [];
  if (showEvDetails && typeof evPercent === "number") {
    metrics.push({
      label: "EV %",
      value: `${evPercent.toFixed(2)}%`,
      highlight: evColor
    });
  }
  if (showArbDetails && typeof arbPercent === "number") {
    metrics.push({
      label: "Arb %",
      value: `${arbPercent.toFixed(2)}%`,
      highlight: "#facc15"
    });
  }
  if (showArbDetails && guaranteedProfit) {
    metrics.push({
      label: "Guaranteed profit",
      value: formatMoney(guaranteedProfit),
      sub: `Sim @ ${formatMoney(stakeUnit)}`
    });
  } else {
    metrics.push({
      label: "Simulated stake",
      value: formatMoney(stakeUnit)
    });
  }

  const scoreboard = game.scoreboard;
  const scoreboardStatus = formatScoreboardStatus(scoreboard);
  const homeScore = getTeamScore(scoreboard, home, "home");
  const awayScore = getTeamScore(scoreboard, away, "away");

  return (
    <article className={`opportunity-card ${variantClass}`}>
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

      {scoreboard && scoreboardStatus && (
        <section className="rounded-2xl bg-[#160d1f] border border-white/10 p-4 text-sm text-white/70 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">
              Status
            </p>
            <p className="font-semibold text-white">{scoreboardStatus}</p>
            {(scoreboard.period || scoreboard.display_clock || scoreboard.clock) && (
              <p className="text-xs text-white/50">
                {scoreboard.period ? `Period ${scoreboard.period}` : ""}
                {(scoreboard.display_clock || scoreboard.clock) &&
                  ` · ${scoreboard.display_clock ?? scoreboard.clock}`}
              </p>
            )}
          </div>
          {typeof awayScore === "number" && typeof homeScore === "number" && (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-white/50">{away}</p>
                <p className="text-xl font-semibold">{awayScore}</p>
              </div>
              <span className="text-white/40 text-lg">:</span>
              <div className="text-center">
                <p className="text-xs text-white/50">{home}</p>
                <p className="text-xl font-semibold">{homeScore}</p>
              </div>
            </div>
          )}
        </section>
      )}

      {metrics.length > 0 && (
        <section className="opportunity-card__metrics">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <span className="opportunity-card__metric-label">{metric.label}</span>
              <strong style={metric.highlight ? { color: metric.highlight } : undefined}>
                {metric.value}
              </strong>
              {metric.sub && <span className="opportunity-card__hint">{metric.sub}</span>}
            </div>
          ))}
        </section>
      )}

      {showArbDetails && hasArb && stakeEntries.length === 2 && (
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
            <p className="font-semibold">
              {formatBetLabel(line.team, line.point, marketKey)} @{" "}
              {oddsDisplay === "american"
                ? line.american
                : `${line.decimal.toFixed(2)} (${((1 / line.decimal) * 100).toFixed(1)}%)`}
            </p>
            <p className="text-xs text-white/60">Sportsbook: {line.sportsbook}</p>
            {showArbDetails && line.stake && (
              <p className="text-xs text-white/60">
                Stake: {formatMoney(line.stake)}
              </p>
            )}
            <p className="text-xs text-white/60">
              Sim profit: <span className="font-semibold">{formatMoney(line.simProfit)}</span>
            </p>
          </div>
        ))}
      </section>

      {bookBreakdowns.length > 0 && (
        <section className="space-y-2">
          <button
            type="button"
            className="text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition border border-white/15 rounded-full px-4 py-1"
            onClick={() => setShowAllBooks((prev) => !prev)}
          >
            {showAllBooks ? "Hide full board" : "View full board"}
          </button>
          {showAllBooks && (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#130c1f]">
              <table className="min-w-full text-sm text-white/70">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.3em] text-white/40">
                    <th className="px-4 py-3 text-left">Sportsbook</th>
                    <th className="px-4 py-3 text-left">{away}</th>
                    <th className="px-4 py-3 text-left">{home}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookBreakdowns.map((book) => {
                    const awayLine = book.outcomes.find((o) => o.team === away);
                    const homeLine = book.outcomes.find((o) => o.team === home);
                    const awayBest = bestLines[away]?.price === awayLine?.decimal;
                    const homeBest = bestLines[home]?.price === homeLine?.decimal;
                    return (
                      <tr key={book.title} className="border-t border-white/5">
                        <td className="px-4 py-3 font-semibold">{book.title}</td>
                        <td
                          className={`px-4 py-3 ${
                            awayBest ? "text-amber-200 font-semibold" : ""
                          }`}
                        >
                          {awayLine
                            ? `${awayLine.american} (${awayLine.decimal.toFixed(2)})`
                            : "n/a"}
                        </td>
                        <td
                          className={`px-4 py-3 ${
                            homeBest ? "text-amber-200 font-semibold" : ""
                          }`}
                        >
                          {homeLine
                            ? `${homeLine.american} (${homeLine.decimal.toFixed(2)})`
                            : "n/a"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <section className="rounded-3xl bg-[#150d22] border border-white/5 p-4 text-sm text-white/70">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1">
          Playbook
        </p>
        <p>{statusCopy}</p>
      </section>
    </article>
  );
}
