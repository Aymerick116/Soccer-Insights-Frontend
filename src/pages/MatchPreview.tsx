import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import type { MatchPreviewResponse, RecentMatch } from '../types/api';
import FormStrip from '../components/FormStrip';
import MetricHelp, { METRIC_DEFINITIONS } from '../components/MetricHelp';
import TeamLogo from '../components/TeamLogo';

export default function MatchPreview() {
  const { matchId } = useParams<{ matchId: string }>();
  const [preview, setPreview] = useState<MatchPreviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getMatchPreview(matchId, 5);
        console.log('Match Preview API Response:', data);
        setPreview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load match preview');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [matchId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading match preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Match not found</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const { match, tags, scores, whyBullets, home, away } = preview;
  
  // Convert UTC date to local time
  const localKickoff = new Date(match.utcDate).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const scoreDisplay = match.score 
    ? `${match.score.home} - ${match.score.away}`
    : null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link to="/" className="text-blue-600 hover:underline inline-flex items-center gap-1">
        ← Back to Dashboard
      </Link>

      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">{match.competition?.name}</p>
          
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex flex-col items-center flex-1">
              <TeamLogo teamId={match.homeTeam.id} teamName={match.homeTeam.name} size="lg" className="mb-2" />
              <Link 
                to={`/team/${match.homeTeam.id}`}
                className="text-lg font-bold hover:text-blue-600 transition-colors text-center"
              >
                {match.homeTeam.name}
              </Link>
            </div>
            
            <div className="text-center px-4">
              {scoreDisplay ? (
                <div className="text-3xl font-bold">{scoreDisplay}</div>
              ) : (
                <div className="text-2xl font-semibold text-gray-400">vs</div>
              )}
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <TeamLogo teamId={match.awayTeam.id} teamName={match.awayTeam.name} size="lg" className="mb-2" />
              <Link 
                to={`/team/${match.awayTeam.id}`}
                className="text-lg font-bold hover:text-blue-600 transition-colors text-center"
              >
                {match.awayTeam.name}
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-gray-600">{localKickoff}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              match.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
              match.status === 'LIVE' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {match.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scores */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Match Scores</h3>
        <div className="grid grid-cols-3 gap-4">
          <MetricHelp
            {...METRIC_DEFINITIONS.btts}
            value={scores.bttsScore}
          />
          <MetricHelp
            {...METRIC_DEFINITIONS.over25}
            value={scores.over25Score}
          />
          <MetricHelp
            {...METRIC_DEFINITIONS.formMismatch}
            value={scores.formMismatchScore}
          />
        </div>
      </div>

      {/* Why This Match is Interesting */}
      {whyBullets && whyBullets.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Why This Match is Interesting</h3>
          <ul className="space-y-2">
            {whyBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span className="text-gray-700">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Comparison */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Form Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">{home.teamName}</p>
            {home.summary?.formString ? (
              <FormStrip form={home.summary.formString.split('')} />
            ) : (
              <p className="text-sm text-gray-400">No form data available</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">{away.teamName}</p>
            {away.summary?.formString ? (
              <FormStrip form={away.summary.formString.split('')} />
            ) : (
              <p className="text-sm text-gray-400">No form data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Recent Matches */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {home.teamName} - Recent Matches
          </h3>
          {home.recentMatches && home.recentMatches.length > 0 ? (
            <RecentMatchesTable matches={home.recentMatches} />
          ) : (
            <p className="text-sm text-gray-400">No recent matches available</p>
          )}
        </div>

        {/* Away Recent Matches */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {away.teamName} - Recent Matches
          </h3>
          {away.recentMatches && away.recentMatches.length > 0 ? (
            <RecentMatchesTable matches={away.recentMatches} />
          ) : (
            <p className="text-sm text-gray-400">No recent matches available</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for recent matches table
function RecentMatchesTable({ matches }: { matches: RecentMatch[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 uppercase">
            <th className="py-2 pr-2">Date</th>
            <th className="py-2 pr-2">Opponent</th>
            <th className="py-2 pr-2">H/A</th>
            <th className="py-2 pr-2">Score</th>
            <th className="py-2">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {matches.map((match, idx) => {
            const matchDate = new Date(match.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            
            const resultClass = 
              match.result === 'W' ? 'bg-green-100 text-green-800' :
              match.result === 'D' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800';

            const homeAwayLabel = match.homeAway === 'HOME' ? 'H' : 'A';

            return (
              <tr key={idx}>
                <td className="py-2 pr-2 text-gray-600">{matchDate}</td>
                <td className="py-2 pr-2 font-medium">{match.opponentName}</td>
                <td className="py-2 pr-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    match.homeAway === 'HOME' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {homeAwayLabel}
                  </span>
                </td>
                <td className="py-2 pr-2">{match.scoreFor}-{match.scoreAgainst}</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${resultClass}`}>
                    {match.result}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

