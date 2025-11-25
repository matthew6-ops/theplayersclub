"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SportTabs from "./SportTabs";
import OddsList from "./OddsList";
import { calcArbBreakdown, calcEvPercent, computeFairProbabilities, buildBestLines } from "@/lib/oddsMath";
import { MARKET_OPTIONS, getMarketConfig } from "@/lib/marketConfig";

type OpportunitiesViewProps = {
  initialResults: any[];
};

export default function OpportunitiesView({
  initialResults,
}: OpportunitiesViewProps) {
  const [results, setResults] = useState<any[]>(initialResults ?? []);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsToRefresh, setSecondsToRefresh] = useState(5);
  const [activeSport, setActiveSport] = useState<string>("all");
  const [opportunityTab, setOpportunityTab] = useState<"ev" | "arb">("ev");
  const [stakeUnit, setStakeUnit] = useState<number>(50);
  const [oddsDisplay, setOddsDisplay] = useState<"american" | "decimal">("american");
  const [stakeInput, setStakeInput] = useState<string>("50");
  const [bookMenuOpen, setBookMenuOpen] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[] | null>(null);
  const [marketKey, setMarketKey] = useState<string>("h2h");
  const bookMenuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!lastUpdated && (initialResults?.length ?? 0) > 0) {
      setLastUpdated(new Date());
    }
  }, [initialResults, lastUpdated]);

  const filteredResults = useMemo(() => {
    if (activeSport === "all") return results;
    return (results ?? []).filter(
      (g: any) => g.sport_key === activeSport
    );
  }, [results, activeSport]);

  const bookmakerOptions = useMemo(() => {
    const set = new Set<string>();
    (results ?? []).forEach((game: any) => {
      (game?.bookmakers ?? []).forEach((bm: any) => {
        const label = bm?.title ?? bm?.key;
        if (label) set.add(label);
      });
    });
    return Array.from(set).sort();
  }, [results]);

  useEffect(() => {
    setSelectedBooks((prev) => {
      if (prev === null) return bookmakerOptions;
      const filtered = prev.filter((book) => bookmakerOptions.includes(book));
      return filtered;
    });
  }, [bookmakerOptions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!bookMenuRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!bookMenuRef.current.contains(e.target)) {
        setBookMenuOpen(false);
      }
    }
    if (bookMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bookMenuOpen]);

  const activeBooks = selectedBooks ?? bookmakerOptions;

  const enrichedGames = useMemo(() => {
    const base = filteredResults ?? [];
    const marketConfig = getMarketConfig(marketKey);
    return base
      .map((game: any) => {
        const outcomes = marketConfig.outcomes(game);
        const best = computeBestPriceMap(game, activeBooks, marketConfig.key, outcomes);
        if (Object.keys(best).length < outcomes.length) return null;
        const evScore = calculateEvScoreFromBest(best);
        const arbPercent = calculateArbPercentFromBest(best);
        return { game, evScore, arbPercent };
      })
      .filter(Boolean) as { game: any; evScore: number | null; arbPercent: number | null }[];
  }, [filteredResults, activeBooks, marketKey]);

  const arbEntries = useMemo(
    () =>
      enrichedGames
        .filter((entry) => typeof entry.arbPercent === "number" && entry.arbPercent > 0)
        .sort((a, b) => (b.arbPercent ?? 0) - (a.arbPercent ?? 0))
        .map((entry) => ({ game: entry.game, viewType: "arb" as const, marketKey })),
    [enrichedGames, marketKey]
  );

  const evEntries = useMemo(
    () =>
      enrichedGames
        .filter((entry) => typeof entry.evScore === "number" && entry.evScore > 0)
        .sort((a, b) => (b.evScore ?? 0) - (a.evScore ?? 0))
        .map((entry) => ({ game: entry.game, viewType: "ev" as const, marketKey })),
    [enrichedGames, marketKey]
  );

  const displayEntries = opportunityTab === "arb" ? arbEntries : evEntries;

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
          setSecondsToRefresh(5);
        }
      } catch {
        // keep last good data, user doesn't need to see the API crying
      }
    }

    refresh();

    const refreshTimer = setInterval(refresh, 5000);
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
    <div className="opportunities-view">
      <div className="dashboard-panel">
        <div>
          <small>Live board</small>
          <h2>Arbitrage Radar</h2>
          <p>Scan every book for two-way edges and instantly size simulated stakes.</p>
        </div>
        <div className="dashboard-panel__meta">
          {lastUpdated && (
            <p>
              Updated {lastUpdated.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" })}
            </p>
          )}
          <p className="dashboard-panel__refresh">Auto refresh in {secondsToRefresh}s</p>
        </div>
      </div>

      <div className="bet-simulator sticky-sim">
        <div>
          <p className="bet-simulator__label">Bet simulator</p>
          <p className="bet-simulator__hint">Enter a bankroll to preview recommended stakes per play.</p>
        </div>
        <div className="bet-simulator__controls">
          <input
            type="number"
            className="bet-simulator__input"
            value={stakeInput}
            placeholder="50"
            onChange={(e) => {
              const next = e.target.value;
              setStakeInput(next);
              if (next === "") {
                setStakeUnit(50);
                return;
              }
              const parsed = Number(next);
              if (Number.isNaN(parsed) || parsed <= 0) {
                setStakeUnit(50);
              } else {
                setStakeUnit(parsed);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-white/60">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={oddsDisplay === "decimal"}
            onChange={(e) => setOddsDisplay(e.target.checked ? "decimal" : "american")}
          />
          Show decimal odds
        </label>
      </div>

      <SportTabs activeSport={activeSport} onChange={(sport) => setActiveSport(sport)} sports={sports} />

      <div className="filter-chips">
        {MARKET_OPTIONS.map((market) => (
          <button
            key={market.key}
            type="button"
            className={`filter-chip${marketKey === market.key ? " active" : ""}`}
            onClick={() => setMarketKey(market.key)}
          >
            {market.label}
          </button>
        ))}
      </div>

      {bookmakerOptions.length > 0 && (
        <div className="book-filter" ref={bookMenuRef}>
          <button type="button" className="book-filter__button" onClick={() => setBookMenuOpen((o) => !o)}>
            Sportsbooks ({activeBooks.length})
          </button>
          {bookMenuOpen && (
            <div className="book-filter__menu">
              <button
                type="button"
                className="book-filter__menu-action"
                onClick={() => setSelectedBooks(bookmakerOptions)}
              >
                Select all
              </button>
              <button
                type="button"
                className="book-filter__menu-action"
                onClick={() => setSelectedBooks([])}
              >
                Clear all
              </button>
              <div className="book-filter__options">
                {bookmakerOptions.map((book) => {
                  const checked = activeBooks.includes(book);
                  return (
                    <label key={book}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedBooks((prev) => {
                            const list = prev ?? [];
                            if (checked) {
                              return list.filter((b) => b !== book);
                            }
                            return Array.from(new Set([...list, book]));
                          });
                        }}
                      />
                      <span>{book}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="filter-chips">
        {[
          { key: "ev", label: "Positive EV Bets" },
          { key: "arb", label: "Arbitrage Plays" },
        ].map((chip) => (
          <button
            key={chip.key}
            type="button"
            className={`filter-chip${opportunityTab === chip.key ? " active" : ""}`}
            onClick={() => setOpportunityTab(chip.key as "ev" | "arb")}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {displayEntries.length === 0 ? (
        <div className="empty-card">
          No opportunities right now. Either the books are sharp, or your
          scraper is asleep.
        </div>
      ) : (
        <OddsList
          results={displayEntries}
          stakeUnit={stakeUnit}
          allowedBooks={activeBooks}
          oddsDisplay={oddsDisplay}
        />
      )}
    </div>
  );
}

function computeBestPriceMap(
  game: any,
  allowedBooks: string[],
  marketKey: string,
  outcomes: string[]
) {
  const allowedSet = allowedBooks?.length ? new Set(allowedBooks) : null;
  const filteredBooks = (game?.bookmakers ?? []).filter((bm: any) => {
    if (!allowedSet) return true;
    return allowedSet.has(bm?.title ?? bm?.key ?? "");
  });

  const bestLines = buildBestLines(filteredBooks, outcomes, marketKey);
  const best: Record<string, number> = {};
  outcomes.forEach((outcome) => {
    const line = bestLines[outcome];
    if (line?.price) best[outcome] = line.price;
  });
  return best;
}

function calculateEvScoreFromBest(best: Record<string, number>) {
  const outcomes = Object.keys(best);
  if (outcomes.length < 2) return null;
  const fair = computeFairProbabilities(best);
  const evs = outcomes
    .map((team) => calcEvPercent(fair[team], best[team]))
    .filter((val): val is number => typeof val === "number");
  if (!evs.length) return null;
  return Math.max(...evs);
}

function calculateArbPercentFromBest(best: Record<string, number>) {
  if (Object.keys(best).length < 2) return null;
  const breakdown = calcArbBreakdown(best, 100);
  return breakdown?.profitPercent ?? null;
}
