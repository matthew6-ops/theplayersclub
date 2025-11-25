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

  return (
    <div className="odds-list mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
    </div>
  );
}
