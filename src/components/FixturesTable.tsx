import { Link, useNavigate } from 'react-router-dom';
import { formatLocalTime, formatScore } from '../utils/dateHelpers';
import TeamLogo from './TeamLogo';

// Accept any shape - we'll normalize it
interface FixturesTableProps {
  rows: any[];
}

// Helper to extract team info (handles string or object)
function getTeamInfo(team: any): { id: number | undefined; name: string } {
  if (typeof team === 'string') {
    return { id: undefined, name: team };
  }
  if (team && typeof team === 'object') {
    return { id: team.id, name: team.name || 'Unknown' };
  }
  return { id: undefined, name: 'Unknown' };
}

export default function FixturesTable({ rows }: FixturesTableProps) {
  const navigate = useNavigate();

  if (!rows || !Array.isArray(rows)) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No fixtures on this date.</p>
      </div>
    );
  }

  // Normalize rows - handle both flat and nested structures
  const normalizedRows = rows.map((row) => {
    // If row has a fixture property, it's nested
    const data = row.fixture || row;
    const tags = row.tags || [];
    
    return {
      matchId: data.matchId,
      utcDate: data.utcDate,
      status: data.status,
      score: data.score,
      homeTeam: getTeamInfo(data.homeTeam),
      awayTeam: getTeamInfo(data.awayTeam),
      quickTag: tags.length > 0 ? tags[0] : (data.quickTag || null),
    };
  });

  // Filter out rows with invalid data
  const validRows = normalizedRows.filter(
    (row) => row.matchId && row.utcDate && row.homeTeam.name && row.awayTeam.name
  );

  if (validRows.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No fixtures on this date.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quick Tag
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {validRows.map((row) => {
              const localTime = formatLocalTime(row.utcDate);
              const scoreDisplay = formatScore(row.status, row.score);

              return (
                <tr
                  key={row.matchId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/match/${row.matchId}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {localTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {row.homeTeam.id && <TeamLogo teamId={row.homeTeam.id} teamName={row.homeTeam.name} size="sm" />}
                        <span className="text-sm font-medium text-gray-900">{row.homeTeam.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">vs</span>
                      <div className="flex items-center gap-2">
                        {row.awayTeam.id && <TeamLogo teamId={row.awayTeam.id} teamName={row.awayTeam.name} size="sm" />}
                        <span className="text-sm font-medium text-gray-900">{row.awayTeam.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${row.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
                        row.status === 'LIVE' || row.status === 'IN_PLAY' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scoreDisplay}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.quickTag || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden divide-y divide-gray-200">
        {validRows.map((row) => {
          const localTime = formatLocalTime(row.utcDate);
          const scoreDisplay = formatScore(row.status, row.score);

          return (
            <Link
              key={row.matchId}
              to={`/match/${row.matchId}`}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{localTime}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${row.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
                    row.status === 'LIVE' || row.status === 'IN_PLAY' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  {row.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1">
                  {row.homeTeam.id && <TeamLogo teamId={row.homeTeam.id} teamName={row.homeTeam.name} size="sm" />}
                  <span className="text-sm font-semibold text-gray-900">{row.homeTeam.name}</span>
                </div>
                <span className="text-gray-400 text-sm">vs</span>
                <div className="flex items-center gap-1">
                  {row.awayTeam.id && <TeamLogo teamId={row.awayTeam.id} teamName={row.awayTeam.name} size="sm" />}
                  <span className="text-sm font-semibold text-gray-900">{row.awayTeam.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {scoreDisplay !== '—' && (
                    <span className="text-sm font-medium">{scoreDisplay}</span>
                  )}
                </div>
                {row.quickTag && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {row.quickTag}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
