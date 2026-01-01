import { Link } from 'react-router-dom';
import type { InsightCard } from '../types/api';
import { formatLocalTime } from '../utils/dateHelpers';
import FormStrip from './FormStrip';
import TeamLogo from './TeamLogo';

interface SpotlightCardProps {
  insight: InsightCard;
}

export default function SpotlightCard({ insight }: SpotlightCardProps) {
  const { fixture, tags, bttsScore, over25Score, formMismatchScore, homeForm, awayForm } = insight;
  
  if (!fixture || !fixture.utcDate) {
    return null;
  }
  
  const localTime = formatLocalTime(fixture.utcDate);
  const scoreDisplay = fixture.status === 'FINISHED' && fixture.score
    ? `${fixture.score.home}–${fixture.score.away}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{fixture.competition?.name || 'Unknown Competition'}</span>
          <span className="text-xs text-gray-500">{localTime}</span>
        </div>
        
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <TeamLogo teamId={fixture.homeTeam.id} teamName={fixture.homeTeam.name} size="md" />
              <span className="font-semibold">{fixture.homeTeam.name}</span>
            </div>
            <span className="text-gray-400">vs</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{fixture.awayTeam.name}</span>
              <TeamLogo teamId={fixture.awayTeam.id} teamName={fixture.awayTeam.name} size="md" />
            </div>
          </div>
          {scoreDisplay && (
            <div className="text-xl font-bold mt-2">{scoreDisplay}</div>
          )}
          <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
            {fixture.status}
          </span>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          {bttsScore !== undefined && (
            <div className="text-center">
              <div className="text-gray-600">BTTS</div>
              <div className="font-semibold">{bttsScore.toFixed(2)}</div>
            </div>
          )}
          {over25Score !== undefined && (
            <div className="text-center">
              <div className="text-gray-600">Over 2.5</div>
              <div className="font-semibold">{over25Score.toFixed(2)}</div>
            </div>
          )}
          {formMismatchScore !== undefined && (
            <div className="text-center">
              <div className="text-gray-600">Mismatch</div>
              <div className="font-semibold">{formMismatchScore.toFixed(2)}</div>
            </div>
          )}
        </div>

        {(homeForm || awayForm) && (
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex-1">
              <div className="text-gray-600 mb-1">{fixture.homeTeam.name}</div>
              {homeForm?.formString ? (
                <FormStrip form={homeForm.formString.split('')} />
              ) : (
                <div className="text-xs text-gray-400">No form data</div>
              )}
            </div>
            <div className="flex-1 ml-4">
              <div className="text-gray-600 mb-1">{fixture.awayTeam.name}</div>
              {awayForm?.formString ? (
                <FormStrip form={awayForm.formString.split('')} />
              ) : (
                <div className="text-xs text-gray-400">No form data</div>
              )}
            </div>
          </div>
        )}
      </div>

      <Link
        to={`/match/${fixture.matchId}`}
        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        View Match
      </Link>
    </div>
  );
}
