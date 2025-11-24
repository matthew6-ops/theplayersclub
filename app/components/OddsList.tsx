import GameCard from "./GameCard";

type OddsListProps = {
  results?: any[];
  data?: { odds?: any[] } | null;
};

export default function OddsList({ results, data }: OddsListProps) {
  const games = results ?? data?.odds ?? [];

  return (
    <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {games.map((game: any, idx: number) => (
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
