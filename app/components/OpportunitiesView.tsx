"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SportTabs from "./SportTabs";
import OddsList from "./OddsList";
import { buildBestLines, calcEvPercent, computeFairProbabilities } from "@/lib/oddsMath";

type OpportunitiesViewProps = {
  initialResults: any[];
};

export default function OpportunitiesView({
  initialResults,
}: OpportunitiesViewProps) {
  const [results, setResults] = useState<any[]>(initialResults ?? []);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsToRefresh, setSecondsToRefresh] = useState(15);
  const [activeSport, setActiveSport] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"all" | "arb" | "ev" | "value">("value");
  const [stakeUnit, setStakeUnit] = useState<number>(50);
  const [stakeInput, setStakeInput] = useState<string>("50");
  const [bookMenuOpen, setBookMenuOpen] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[] | null>(null);
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

  const preparedResults = useMemo(() => {
    const base = filteredResults ?? [];
    const withMeta = base.map((game: any) => {
      const evScore = calculateEvScore(game, activeBooks);
      const valueScore = calculateValueScore(game, activeBooks);
      return {
        ...game,
        _evScore: evScore,
        _valueScore: valueScore,
        _priorityScore: calculatePriorityScore(game, evScore, valueScore),
      };
    });

    let filtered = withMeta;
    if (filterMode === "arb") {
      filtered = filtered.filter((g) => g?.arb?.exists);
    } else if (filterMode === "ev") {
      filtered = filtered.filter((g) => Number.isFinite(g._evScore));
    } else if (filterMode === "value") {
      filtered = filtered.filter((g) => g._valueScore !== null);
    }

    const sorted = [...filtered].sort(
      (a, b) => (b?._priorityScore ?? -Infinity) - (a?._priorityScore ?? -Infinity)
    );

    return sorted;
  }, [filteredResults, filterMode, activeBooks]);

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
          setSecondsToRefresh(15);
        }
      } catch {
        // keep last good data, user doesn't need to see the API crying
      }
    }

    refresh();

    const refreshTimer = setInterval(refresh, 15000);
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

      <div className="bet-simulator">
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

      <SportTabs activeSport={activeSport} onChange={(sport) => setActiveSport(sport)} sports={sports} />

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
          { key: "value", label: "All bets" },
          { key: "arb", label: "Arb only" },
          { key: "ev", label: "+EV only" },
        ].map((chip) => (
          <button
            key={chip.key}
            type="button"
            className={`filter-chip${filterMode === chip.key ? " active" : ""}`}
            onClick={() => setFilterMode(chip.key as "arb" | "ev" | "value")}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {preparedResults.length === 0 ? (
        <div className="empty-card">
          No opportunities right now. Either the books are sharp, or your
          scraper is asleep.
        </div>
      ) : (
        <OddsList results={preparedResults} stakeUnit={stakeUnit} allowedBooks={activeBooks} />
      )}
    </div>
  );
}

function calculateEvScore(game: any, allowedBooks: string[]) {
  const home = game?.home_team;
  const away = game?.away_team;
  if (!home || !away) return null;

  const allowedSet = allowedBooks?.length ? new Set(allowedBooks) : null;
  const filteredBooks = (game?.bookmakers ?? []).filter((bm: any) => {
    if (!allowedSet) return true;
    return allowedSet.has(bm?.title ?? bm?.key ?? "");
  });

  const bestLines = buildBestLines(filteredBooks, [home, away]);
  const best: Record<string, number> = {};
  [home, away].forEach((team) => {
    const line = bestLines[team];
    if (line?.price) best[team] = line.price;
  });
  if (Object.keys(best).length < 2) return null;

  const fair = computeFairProbabilities(best);
  const homeEv = calcEvPercent(fair[home], best[home]);
  const awayEv = calcEvPercent(fair[away], best[away]);
  const evs = [homeEv, awayEv].filter((val) => typeof val === "number");
  if (!evs.length) return null;
  return Math.max(...(evs as number[]));
}

function calculateValueScore(game: any, allowedBooks: string[]) {
  const home = game?.home_team;
  const away = game?.away_team;
  if (!home || !away) return null;

  const allowedSet = allowedBooks?.length ? new Set(allowedBooks) : null;
  const filteredBooks = (game?.bookmakers ?? []).filter((bm: any) => {
    if (!allowedSet) return true;
    return allowedSet.has(bm?.title ?? bm?.key ?? "");
  });

  const bestLines = buildBestLines(filteredBooks, [home, away]);
  const prices = [bestLines[home]?.price, bestLines[away]?.price].filter(
    (val): val is number => typeof val === "number"
  );
  if (!prices.length) return null;
  return Math.max(...prices);
}

function calculatePriorityScore(game: any, evScore: number | null, valueScore: number | null) {
  const arbPercent =
    typeof game?.arb?.profitPercent === "number" ? game.arb.profitPercent : null;

  if (arbPercent !== null && arbPercent > 0) {
    return 3000 + arbPercent;
  }

  if (typeof evScore === "number" && evScore > 0) {
    return 2000 + evScore;
  }

  if (valueScore !== null) {
    return 1000 + valueScore;
  }

  return 0;
}
