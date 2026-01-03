/** API types matching backend Pydantic models */

// ===== Base Types =====
export interface TeamRef {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crestUrl?: string;
}

export interface Score {
  home: number | null;
  away: number | null;
}

export interface Competition {
  code: string;
  name: string;
  areaName?: string;
}

export interface Fixture {
  matchId: number;
  utcDate: string; // ISO datetime string in UTC
  status: string; // "SCHEDULED", "LIVE", "FINISHED", etc.
  matchday?: number;
  competition: Competition;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  score: Score;
}

// ===== Team Summary =====
export interface TeamSummary {
  teamId: number;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  avgGoalsFor: number;
  avgGoalsAgainst: number;
  bttsRate: number;
  over25Rate: number;
  cleanSheetRate: number;
  formString: string;
}

// ===== Recent Match Row =====
export interface RecentMatchRow {
  date: string; // ISO date string
  opponentName: string;
  homeAway: 'HOME' | 'AWAY';
  scoreFor: number;
  scoreAgainst: number;
  result: 'W' | 'D' | 'L';
}

// ===== Insight Scores =====
export interface InsightScores {
  bttsScore: number;
  over25Score: number;
  formMismatchScore: number;
}

// ===== Insight Card =====
export interface InsightCard {
  fixture: Fixture;
  homeSummary: TeamSummary;
  awaySummary: TeamSummary;
  scores: InsightScores;
  tags: string[];
}

// ===== Rankings =====
export interface RankingItem {
  fixture: {
    matchId: number;
    homeTeam: string | TeamRef;
    awayTeam: string | TeamRef;
    utcDate?: string;
  };
  score: number | { bttsScore?: number; over25Score?: number; formMismatchScore?: number };
}

export interface Rankings {
  highGoals: RankingItem[];
  highBTTS: RankingItem[];
  mismatch: RankingItem[];
}

// ===== Fixtures Table Item =====
export interface FixturesTableItem {
  fixture: Fixture;
  tags: string[];
}

// ===== Dashboard Response =====
export interface DashboardResponse {
  date: string; // YYYY-MM-DD
  spotlight: InsightCard[];
  rankings: Rankings;
  fixturesTable: FixturesTableItem[];
}

// ===== Upcoming Page Types =====
export type UpcomingRange = 'today' | 'tomorrow' | 'weekend' | 'next7';

export interface UpcomingResponse {
  dateFrom: string;
  dateTo: string;
  range: UpcomingRange;
  fixtures: FixturesTableItem[];
  spotlight: InsightCard[];
}

// ===== Match Preview Types =====
export interface TeamPreviewData {
  team: TeamRef;
  summary: TeamSummary;
  recentMatches: RecentMatchRow[];
}

export interface MatchPreviewResponse {
  match: Fixture;
  tags: string[];
  scores: InsightScores;
  whyBullets: string[];
  home: TeamPreviewData;
  away: TeamPreviewData;
}

// ===== Team Insights Response =====
export interface TeamInsightsResponse {
  team: TeamRef;
  summary: TeamSummary;
  recentMatches: RecentMatchRow[];
}

// ===== Health Check =====
export interface HealthResponse {
  ok: boolean;
  timestamp: string;
  database: string;
  databaseOk: boolean;
}

// ===== Legacy types (kept for backward compatibility) =====
export interface DashboardInsights {
  featured_matches: number[];
  trending_teams: number[];
  upcoming_highlights: Array<{
    type: string;
    id: number;
    title: string;
  }>;
}
