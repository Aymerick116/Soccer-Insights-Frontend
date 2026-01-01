import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import type { TeamInsights } from '../types/api';

export default function TeamPage() {
  const { id } = useParams<{ id: string }>();
  const [insights, setInsights] = useState<TeamInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getTeamInsights(parseInt(id));
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
    return <div className="text-center py-12">Loading team insights...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  if (!insights) {
    return <div className="text-center py-12">Team not found</div>;
  }

  return (
    <div>
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Dashboard
      </Link>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">{insights.team.name}</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Matches Played</p>
                <p className="text-2xl font-bold">{insights.stats.matches_played}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Wins</p>
                <p className="text-2xl font-bold text-green-600">{insights.stats.wins}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Draws</p>
                <p className="text-2xl font-bold text-yellow-600">{insights.stats.draws}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Losses</p>
                <p className="text-2xl font-bold text-red-600">{insights.stats.losses}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Goals For</p>
                <p className="text-2xl font-bold">{insights.stats.goals_for}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Goals Against</p>
                <p className="text-2xl font-bold">{insights.stats.goals_against}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Form</h2>
            <div className="flex space-x-2">
              {insights.recent_form.map((result, idx) => (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded flex items-center justify-center font-bold ${
                    result === 'W'
                      ? 'bg-green-500 text-white'
                      : result === 'D'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Fixtures</h2>
            <div className="space-y-2">
              {insights.upcoming_fixtures.map((fixtureId) => (
                <Link
                  key={fixtureId}
                  to={`/match/${fixtureId}`}
                  className="block p-3 border rounded hover:bg-gray-50"
                >
                  Match #{fixtureId}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

