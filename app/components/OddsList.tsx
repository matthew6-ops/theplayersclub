import GameCard from "./GameCard";

type OpportunityEntry = {
  game: any;
  viewType?: "arb" | "ev";
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
      ? item
      : { game: item }
  );

  return (
    <div className="opps-grid odds-list">
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
        />
      ))}
    </div>
  );
}
