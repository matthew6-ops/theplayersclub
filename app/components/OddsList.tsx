import GameCard from "./GameCard";

type OddsListProps = {
  results: any[];
};

export default function OddsList({ results }: OddsListProps) {
  return (
    <div className="mt-3 grid gap-4 md:grid-cols-2">
      {results.map((game: any, idx: number) => (
        <GameCard
          key={
            game.id ??
            `${game.sport_key}-${game.home_team}-${game.away_team}-${idx}`
          }
          game={game}
        />
      ))}
    </div>
  );
}
