import { useState, useRef, useEffect, useCallback } from 'react';

interface MetricHelpProps {
    label: string;
    value?: string | number;
    definition: string;
    howComputed?: string;
    example?: string;
}

export default function MetricHelp({
    label,
    value,
    definition,
    howComputed,
    example,
}: MetricHelpProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleToggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, handleClose]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
                buttonRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, handleClose]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
        }
    };

    const formattedValue =
        value !== undefined
            ? typeof value === 'number'
                ? value.toFixed(2)
                : value
            : '-';

    return (
        <div ref={containerRef} className="relative inline-block w-full">
            {/* Metric Card */}
            <div className="p-3 bg-gray-50 rounded-lg text-center">
                {/* Label with info icon */}
                <div className="flex items-center justify-center gap-1 mb-1">
                    <p className="text-xs text-gray-500">{label}</p>
                    <button
                        ref={buttonRef}
                        type="button"
                        onClick={handleToggle}
                        onKeyDown={handleKeyDown}
                        aria-label={`More info about ${label}`}
                        aria-expanded={isOpen}
                        aria-haspopup="dialog"
                        className="inline-flex items-center justify-center w-4 h-4 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-full transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Value */}
                <p className="text-xl font-bold text-gray-900">{formattedValue}</p>
            </div>

            {/* Tooltip/Popover */}
            {isOpen && (
                <>
                    {/* Mobile backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 z-40 md:hidden"
                        aria-hidden="true"
                        onClick={handleClose}
                    />

                    {/* Tooltip content */}
                    <div
                        role="dialog"
                        aria-labelledby={`metric-help-title-${label}`}
                        className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-left
                       md:w-80
                       /* Mobile: center on screen */
                       max-md:fixed max-md:left-1/2 max-md:top-1/2 max-md:-translate-y-1/2 max-md:mt-0"
                    >
                        {/* Close button for mobile */}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded md:hidden"
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>

                        {/* Title */}
                        <h4
                            id={`metric-help-title-${label}`}
                            className="font-semibold text-gray-900 mb-2"
                        >
                            {label}
                        </h4>

                        {/* Definition */}
                        <p className="text-sm text-gray-700 mb-3">{definition}</p>

                        {/* How it's computed */}
                        {howComputed && (
                            <div className="mb-3">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    How it's calculated
                                </p>
                                <p className="text-sm text-gray-600">{howComputed}</p>
                            </div>
                        )}

                        {/* Example */}
                        {example && (
                            <div className="bg-blue-50 rounded p-2 border border-blue-100">
                                <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                                    Example
                                </p>
                                <p className="text-sm text-blue-800">{example}</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// Metric definitions for easy reuse
export const METRIC_DEFINITIONS = {
    btts: {
        label: 'BTTS',
        definition:
            'Both Teams To Score. This measures how often both teams score at least one goal in a match.',
        howComputed:
            "We look at each team's last N finished matches and count the % where both teams scored. The match BTTS score is the average of the two teams' rates.",
        example:
            'If Arsenal had BTTS in 4 of their last 5 (80%) and Chelsea had 3 of 5 (60%), the combined BTTS score is (0.8 + 0.6) / 2 = 0.70.',
    },
    over25: {
        label: 'Over 2.5',
        definition:
            'The share of matches with 3 or more total goals (e.g., 2–1, 3–0, 2–2).',
        howComputed:
            "We compute the % of each team's last N matches that ended with total goals ≥ 3. The match Over 2.5 score is the average of the two teams' rates.",
        example:
            'If Team A is 3/5 and Team B is 4/5, combined score is (0.6 + 0.8)/2 = 0.70.',
    },
    formMismatch: {
        label: 'Form Mismatch',
        definition:
            "A simple indicator of how different the two teams' recent results are.",
        howComputed:
            'We convert recent results into points (Win=3, Draw=1, Loss=0) over the last N matches. Form mismatch is the absolute difference in points divided by (3*N), so it ranges from 0 to 1.',
        example:
            'If one team has 12 points in the last 5 and the other has 3, mismatch = |12-3| / 15 = 0.60.',
    },
    cleanSheet: {
        label: 'Clean Sheet',
        definition:
            'The percentage of matches where a team did not concede any goals.',
        howComputed:
            "We look at each team's last N matches and count how many ended with zero goals conceded. The score is the average of both teams' clean sheet rates.",
        example:
            'If Team A kept 2 clean sheets in 5 games (40%) and Team B kept 3 (60%), combined = (0.4 + 0.6)/2 = 0.50.',
    },
} as const;
