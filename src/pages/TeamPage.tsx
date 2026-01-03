import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import type { TeamInsightsResponse, RecentMatchRow } from '../types/api';
import FormStrip from '../components/FormStrip';

export default function TeamPage() {
  const { id } = useParams<{ id: string }>();
  const [insights, setInsights] = useState<TeamInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getTeamInsights(parseInt(id), 10);
        setInsights(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load team');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading team insights...</p>
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

  if (!insights) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Team not found</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const { team, summary, recentMatches } = insights;

  return (
    <div className="space-y-6">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">{team.name}</h1>

        {/* Form String */}
        {summary.formString && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Recent Form</h2>
            <FormStrip form={summary.formString.split('')} />
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Matches</p>
              <p className="text-2xl font-bold">{summary.matchesPlayed}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Wins</p>
              <p className="text-2xl font-bold text-green-600">{summary.wins}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Draws</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.draws}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Losses</p>
              <p className="text-2xl font-bold text-red-600">{summary.losses}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Points</p>
              <p className="text-2xl font-bold">{summary.points}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Goals For</p>
              <p className="text-2xl font-bold">{summary.goalsFor}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Goals Against</p>
              <p className="text-2xl font-bold">{summary.goalsAgainst}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Avg GF</p>
              <p className="text-2xl font-bold">{summary.avgGoalsFor.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Rates */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Rates</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded text-center">
              <p className="text-sm text-blue-600">BTTS Rate</p>
              <p className="text-xl font-bold text-blue-800">{(summary.bttsRate * 100).toFixed(0)}%</p>
            </div>
            <div className="p-4 bg-blue-50 rounded text-center">
              <p className="text-sm text-blue-600">Over 2.5 Rate</p>
              <p className="text-xl font-bold text-blue-800">{(summary.over25Rate * 100).toFixed(0)}%</p>
            </div>
            <div className="p-4 bg-blue-50 rounded text-center">
              <p className="text-sm text-blue-600">Clean Sheet Rate</p>
              <p className="text-xl font-bold text-blue-800">{(summary.cleanSheetRate * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        {recentMatches && recentMatches.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Opponent</th>
                    <th className="py-2 pr-4">H/A</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentMatches.map((match: RecentMatchRow, idx: number) => {
                    const matchDate = new Date(match.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                    const resultClass =
                      match.result === 'W' ? 'bg-green-100 text-green-800' :
                        match.result === 'D' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800';

                    return (
                      <tr key={idx}>
                        <td className="py-2 pr-4 text-gray-600">{matchDate}</td>
                        <td className="py-2 pr-4 font-medium">{match.opponentName}</td>
                        <td className="py-2 pr-4">
                          <span className={`px-2 py-0.5 rounded text-xs ${match.homeAway === 'HOME' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {match.homeAway === 'HOME' ? 'H' : 'A'}
                          </span>
                        </td>
                        <td className="py-2 pr-4">{match.scoreFor}-{match.scoreAgainst}</td>
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
          </div>
        )}
      </div>
    </div>
  );
}

