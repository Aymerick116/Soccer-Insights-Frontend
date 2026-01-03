import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { DashboardResponse } from '../types/api';
import { getTodayNY } from '../utils/dateHelpers';
import SpotlightCard from '../components/SpotlightCard';
import RankingsColumn from '../components/RankingsColumn';
import FixturesTable from '../components/FixturesTable';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayNY());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Clear stale data immediately when starting a new fetch
        setDashboardData(null);
        const data = await api.getDashboard(selectedDate);
        // Log for debugging (remove in production)
        console.log('Dashboard API Response:', data);
        console.log('Rankings:', data.rankings);
        console.log('HighGoals first item:', data.rankings?.highGoals?.[0]);
        console.log('FixturesTable first item:', data.fixturesTable?.[0]);
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    const isCorsError = error.includes('CORS') || error.includes('Network error');
    const isServerError = error.includes('500') || error.includes('API error: 500');

    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>

          {isCorsError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4 text-left">
              <p className="text-sm text-yellow-800">
                <strong>CORS Issue:</strong> Make sure your FastAPI backend is running and CORS middleware is properly configured.
                Check that <code className="bg-yellow-100 px-1 rounded">http://localhost:5173</code> is in the <code className="bg-yellow-100 px-1 rounded">allow_origins</code> list.
              </p>
            </div>
          )}

          {isServerError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4 text-left">
              <p className="text-sm text-yellow-800">
                <strong>Backend Error:</strong> The backend returned a 500 error.
                Check your backend logs for details. This might be due to:
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-yellow-700">
                <li>Invalid date format</li>
                <li>Database connection issues</li>
                <li>API provider errors</li>
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setError(null);
              setSelectedDate(getTodayNY());
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-center py-12">No data available</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <label htmlFor="date-input" className="text-sm font-medium text-gray-700">
            Date:
          </label>
          <input
            id="date-input"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Section A: Spotlight */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Spotlight</h2>
        {dashboardData.spotlight.length === 0 ? (
          <p className="text-gray-500">No spotlight matches for this date.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.spotlight.map((insight, idx) => (
              <SpotlightCard key={insight.fixture.matchId || idx} insight={insight} />
            ))}
          </div>
        )}
      </section>

      {/* Section B: Rankings */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rankings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RankingsColumn title="High Goals" items={dashboardData.rankings.highGoals} />
          <RankingsColumn title="High BTTS" items={dashboardData.rankings.highBTTS} />
          <RankingsColumn title="Form Mismatch" items={dashboardData.rankings.mismatch} />
        </div>
      </section>

      {/* Section C: All Fixtures */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Fixtures</h2>
        {dashboardData.fixturesTable.length === 0 ? (
          <p className="text-gray-500">No fixtures for this date.</p>
        ) : (
          <FixturesTable rows={dashboardData.fixturesTable} />
        )}
      </section>
    </div>
  );
}
