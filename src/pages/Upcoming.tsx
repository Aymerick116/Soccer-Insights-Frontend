import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { UpcomingRange, InsightCard } from '../types/api';
import SpotlightCard from '../components/SpotlightCard';
import { formatLocalDate, getLocalDateKey } from '../utils/dateHelpers';

const RANGE_OPTIONS: { value: UpcomingRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'weekend', label: 'This Weekend' },
  { value: 'next7', label: 'Next 7 Days' },
];

// Helper to get team name (handles string or object)
function getTeamName(team: any): string {
  if (typeof team === 'string') return team;
  if (team && typeof team === 'object') return team.name || 'Unknown';
  return 'Unknown';
}

// Normalize fixture item (handles both flat and nested structures)
function normalizeFixture(item: any) {
  const data = item.fixture || item;
  const tags = item.tags || [];
  return {
    matchId: data.matchId,
    utcDate: data.utcDate,
    status: data.status,
    homeTeamName: getTeamName(data.homeTeam),
    awayTeamName: getTeamName(data.awayTeam),
    quickTag: tags.length > 0 ? tags[0] : null,
  };
}

export default function Upcoming() {
  const [range, setRange] = useState<UpcomingRange>('next7');
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [spotlight, setSpotlight] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    // Clear stale data when range changes
    setFixtures([]);
    setSpotlight([]);

    api.getUpcoming(range)
      .then((data) => {
        if (cancelled) return;
        console.log('Upcoming API Response:', data);
        setFixtures(data.fixtures || []);
        setSpotlight(data.spotlight || []);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load upcoming matches');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  // Normalize and group fixtures by local date
  const normalizedFixtures = useMemo(() => {
    return fixtures.map(normalizeFixture).filter(f => f.matchId && f.utcDate);
  }, [fixtures]);

  const fixturesByDate = useMemo(() => {
    const grouped: Record<string, typeof normalizedFixtures> = {};
    for (const item of normalizedFixtures) {
      const dateKey = getLocalDateKey(item.utcDate);
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(item);
    }
    return grouped;
  }, [normalizedFixtures]);

  const sortedDates = useMemo(
    () => Object.keys(fixturesByDate).sort(),
    [fixturesByDate]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upcoming Matches</h1>
          <p className="text-gray-500 mt-1">Browse fixtures and find insight opportunities</p>
        </div>
        {/* Range Selector */}
        <div className="flex gap-2 flex-wrap">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${range === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Spotlight Section */}
          {spotlight.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                🔥 Spotlight Picks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {spotlight.map((card, idx) => (
                  <SpotlightCard key={card.fixture?.matchId || idx} insight={card} />
                ))}
              </div>
            </section>
          )}

          {/* Fixtures by Date */}
          {sortedDates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No matches found for this period.
            </div>
          ) : (
            <section className="space-y-6">
              {sortedDates.map((dateKey) => (
                <div key={dateKey}>
                  <h3 className="text-md font-semibold text-gray-700 mb-3 sticky top-0 bg-gray-50 py-2 -mx-4 px-4">
                    {formatLocalDate(dateKey + 'T12:00:00Z')}
                  </h3>
                  <div className="bg-white rounded-xl shadow overflow-hidden divide-y divide-gray-100">
                    {fixturesByDate[dateKey].map((item) => {
                      const teamsLabel = `${item.homeTeamName} vs ${item.awayTeamName}`;

                      return (
                        <Link
                          key={item.matchId}
                          to={`/match/${item.matchId}`}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {teamsLabel}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(item.utcDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          {item.quickTag && (
                            <span className="ml-4 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                              {item.quickTag}
                            </span>
                          )}
                          <svg
                            className="ml-4 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
