import { Link } from 'react-router-dom';
import type { RankingItem } from '../types/api';

interface RankingsColumnProps {
  title: string;
  items: RankingItem[];
}

export default function RankingsColumn({ title, items }: RankingsColumnProps) {
  // Filter out items with invalid fixtures and take top 5
  const validItems = items
    .filter((item) => item.fixture && item.fixture.matchId)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {validItems.length === 0 ? (
          <p className="text-sm text-gray-500">No items</p>
        ) : (
          validItems.map((item, idx) => (
            <Link
              key={item.fixture.matchId || idx}
              to={`/match/${item.fixture.matchId}`}
              className="block p-3 border rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.teams || 'Unknown'}</div>
                  {item.fixture.utcDate && (
                    <div className="text-xs text-gray-500">
                      {new Date(item.fixture.utcDate).toLocaleTimeString('en-US', {
                        timeZone: 'America/New_York',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <span className="text-sm font-semibold text-blue-600">
                    {typeof item.score === 'number' ? item.score.toFixed(2) : 'N/A'}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

