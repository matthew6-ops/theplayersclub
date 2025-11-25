import GameCard from "./GameCard";

type OpportunityEntry = {
  game: any;
  viewType?: "arb" | "ev";
  marketKey: string;
};

type OddsListProps = {
  results?: OpportunityEntry[] | any[];
  data?: { odds?: any[] } | null;
  stakeUnit: number;
  allowedBooks: string[];
  oddsDisplay?: "american" | "decimal";
};

export default function OddsList({
  results,
  data,
  stakeUnit,
  allowedBooks,
  oddsDisplay = "american"
}: OddsListProps) {
  const games = results ?? data?.odds ?? [];
  const entries: OpportunityEntry[] = games.map((item: any) =>
    item && item.game
      ? {
          game: item.game,
          viewType: item.viewType,
          marketKey: item.marketKey ?? "h2h"
        }
      : { game: item, marketKey: "h2h" }
  );

  // We aim for a 3-column layout on desktop; add placeholders
  // so rows look balanced when there are 1 or 2 items.
  const columnTarget = 3;
  const remainder = entries.length % columnTarget;
  const placeholderCount =
    entries.length === 0 ? columnTarget : remainder === 0 ? 0 : columnTarget - remainder;

  return (
    <div className="odds-list">
      {entries.map((entry, idx) => (
        <GameCard
          key={
            entry.game.id ??
            `${entry.game.sport_key}-${entry.game.home_team}-${entry.game.away_team}-${idx}`
          }
          game={entry.game}
          stakeUnit={stakeUnit}
          allowedBooks={allowedBooks}
          viewType={entry.viewType}
          oddsDisplay={oddsDisplay}
          marketKey={entry.marketKey}
        />
      ))}
      {Array.from({ length: placeholderCount }).map((_, idx) => (
        <div key={`placeholder-${idx}`} className="opportunity-card opportunity-card--placeholder" />
      ))}
    </div>
  );
}
