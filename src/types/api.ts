/** API types matching backend Pydantic models */

export interface Team {
  id: number;
  name: string;
  short_name: string;
  logo_url?: string;
  country?: string;
}

export interface TeamRef {
  id: number;
  name: string;
  short_name?: string;
}

export interface Score {
  home?: number;
  away?: number;
}

export interface Competition {
  id: number;
  name: string;
  country?: string;
}

export interface Fixture {
  id?: number;
  matchId: number;
  competition: Competition;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  utcDate: string; // ISO datetime string in UTC
  status: string; // "SCHEDULED", "LIVE", "FINISHED", etc.
  score?: Score;
  venue?: string;
}

export interface TeamSummary {
  team: TeamRef;
  formString: string; // e.g., "WWLDD"
}

export interface InsightCard {
  fixture: Fixture;
  tags?: string[];
  bttsScore?: number;
  over25Score?: number;
  formMismatchScore?: number;
  homeForm: TeamSummary;
  awayForm: TeamSummary;
}

export interface RankingItem {
  fixture: Fixture;
  score: number;
  teams: string; // e.g., "Team A vs Team B"
}

export interface Rankings {
  highGoals: RankingItem[];
  highBTTS: RankingItem[];
  mismatch: RankingItem[];
}

export interface FixturesTableRow {
  matchId: number;
  utcDate: string;
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  status: string;
  score: { home: number | null; away: number | null };
  quickTag: string | null;
}

export interface DashboardResponse {
  date: string; // YYYY-MM-DD
  spotlight: InsightCard[];
  rankings: Rankings;
  fixturesTable: FixturesTableRow[];
}

// Match Preview types
export interface RecentMatch {
  date: string; // ISO date string
  opponentName: string;
  homeAway: 'HOME' | 'AWAY';
  scoreFor: number;
  scoreAgainst: number;
  result: 'W' | 'D' | 'L';
}

export interface TeamPreviewSummary {
  wins: number;
  draws: number;
  losses: number;
  points: number;
  gf: number;
  ga: number;
  avgGf: number;
  avgGa: number;
  bttsRate: number;
  over25Rate: number;
  cleanSheetRate: number;
  formString: string;
}

export interface TeamPreview {
  teamId: number;
  teamName: string;
  summary: TeamPreviewSummary;
  recentMatches: RecentMatch[];
}

export interface MatchPreviewScores {
  bttsScore: number;
  over25Score: number;
  formMismatchScore: number;
}

export interface MatchPreviewMatch {
  matchId: number;
  utcDate: string;
  status: string;
  competition: {
    id: string;
    name: string;
    areaName?: string;
  };
  homeTeam: {
    id: number;
    name: string;
  };
  awayTeam: {
    id: number;
    name: string;
  };
  score?: {
    home: number;
    away: number;
  };
}

export interface MatchPreviewResponse {
  match: MatchPreviewMatch;
  tags: string[];
  scores: MatchPreviewScores;
  whyBullets: string[];
  home: TeamPreview;
  away: TeamPreview;
}

// Legacy types (keeping for backward compatibility with other pages)
export interface TeamStats {
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
}

export interface TeamInsights {
  team: Team;
  stats: TeamStats;
  recent_form: string[]; // e.g., ["W", "W", "L", "D", "W"]
  upcoming_fixtures: number[]; // fixture IDs
}

export interface DashboardInsights {
  featured_matches: number[]; // fixture IDs
  trending_teams: number[]; // team IDs
  upcoming_highlights: Array<{
    type: string;
    id: number;
    title: string;
  }>;
}
