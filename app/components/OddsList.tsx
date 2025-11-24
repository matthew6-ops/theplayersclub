"use client"

type OddsListProps = {
  data: any
}

export default function OddsList({ data }: OddsListProps) {
  if (!data || !data.odds) return null

  return (
    <div className="mt-6 space-y-6">
      {data.odds.map((game: any) => (
        <div
          key={game.id}
          className="border border-neutral-700 p-4 rounded-lg bg-neutral-900"
        >
          <div className="text-lg font-semibold mb-2">
            {game.home_team} vs {game.away_team}
          </div>

          {game.bookmakers.map((book: any) => (
            <div key={book.key} className="mt-3">
              <div className="font-semibold text-neutral-400">
                {book.title}
              </div>

              {book.markets.map((market: any) => (
                <div
                  key={market.key}
                  className="ml-4 mt-2 text-sm text-neutral-300"
                >
                  <div className="uppercase font-bold">{market.key}</div>

                  {market.outcomes.map((o: any) => (
                    <div key={o.name} className="ml-2">
                      {o.name}: <span className="font-mono">{o.price}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
