export type Outcome = {
  name: string;
  price: number;
  point?: number;
};

export type Market = {
  key: string;
  outcomes?: Outcome[];
};

export type Bookmaker = {
  key?: string;
  title?: string;
  markets?: Market[];
  last_update?: string;
};

export type ScoreboardTeamScore = {
  name?: string;
  score?: number;
};

export type Scoreboard = {
  status?: string;
  completed?: boolean;
  in_progress?: boolean;
  period?: string | number;
  display_clock?: string;
  clock?: string;
  home_score?: number;
  away_score?: number;
  scores?: ScoreboardTeamScore[];
};

export type ArbitrageResult =
  | {
      exists: true;
      profitPercent: number;
      teams: [string, string];
    }
  | {
      exists: false;
    }
  | null;

export type GameOpportunity = {
  id?: string;
  sport_key: string;
  sport_title?: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
  arb?: ArbitrageResult;
  scoreboard?: Scoreboard;
};
