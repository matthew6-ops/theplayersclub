import GameCard from "./GameCard";

type OddsListProps = {
  results?: any[];
  data?: { odds?: any[] } | null;
};

export default function OddsList({ results, data }: OddsListProps) {
  const games = results ?? data?.odds ?? [];

  return (
    <div className="opps-grid">
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
