type Game = {
  home_team?: string;
  away_team?: string;
};

export type MarketConfig = {
  key: string;
  label: string;
  outcomes: (game: Game) => string[];
};

export const MARKET_OPTIONS: MarketConfig[] = [
  {
    key: "h2h",
    label: "Moneyline",
    outcomes: (game) => [game.away_team ?? "Away", game.home_team ?? "Home"]
  },
  {
    key: "spreads",
    label: "Spreads",
    outcomes: (game) => [game.away_team ?? "Away", game.home_team ?? "Home"]
  },
  {
    key: "totals",
    label: "Totals",
    outcomes: () => ["Over", "Under"]
  }
];

export function getMarketConfig(key: string) {
  return MARKET_OPTIONS.find((m) => m.key === key) ?? MARKET_OPTIONS[0];
}
