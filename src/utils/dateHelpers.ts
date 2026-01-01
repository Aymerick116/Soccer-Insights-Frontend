/**
 * Get today's date in America/New_York timezone formatted as YYYY-MM-DD
 */
export function getTodayNY(): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(new Date());
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  
  return `${year}-${month}-${day}`;
}

/**
 * Format UTC date string to local time (America/New_York) as "2:30 PM"
 */
export function formatLocalTime(utcDate: string): string {
  const date = new Date(utcDate);
  
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format score display based on status
 */
export function formatScore(
  status: string,
  score: { home: number | null; away: number | null } | undefined
): string {
  if (!score || score.home === null || score.away === null) {
    return '—';
  }
  if (status === 'FINISHED' || status === 'LIVE' || status === 'IN_PLAY') {
    return `${score.home}–${score.away}`;
  }
  return '—';
}

