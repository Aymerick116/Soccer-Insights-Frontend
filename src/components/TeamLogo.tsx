import { useState } from 'react';

/**
 * Get team logo URL from football-data.org
 * Falls back to a placeholder if the team ID is invalid
 */
export function getTeamLogoUrl(teamId: number): string {
    return `https://crests.football-data.org/${teamId}.png`;
}

interface TeamLogoProps {
    teamId: number;
    teamName: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
};

export default function TeamLogo({ teamId, teamName, size = 'md', className = '' }: TeamLogoProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        // Fallback: show initials in a colored circle
        const initials = teamName
            .split(' ')
            .map((word) => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

        return (
            <div
                className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold ${className}`}
                style={{ fontSize: size === 'sm' ? '0.5rem' : size === 'md' ? '0.625rem' : '0.75rem' }}
                title={teamName}
            >
                {initials}
            </div>
        );
    }

    return (
        <img
            src={getTeamLogoUrl(teamId)}
            alt={`${teamName} logo`}
            className={`${sizeClasses[size]} object-contain ${className}`}
            onError={() => setHasError(true)}
            loading="lazy"
        />
    );
}
