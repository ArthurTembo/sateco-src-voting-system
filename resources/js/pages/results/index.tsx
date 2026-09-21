import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Results', href: '/results' },
];

interface GenderTurnout {
    registered: number;
    voted: number;
    turnout_rate: number;
}

interface ResultsOverview {
    total_votes_cast: number;
    registered_voters: number;
    voted_voters: number;
    turnout_rate: number;
    male: GenderTurnout;
    female: GenderTurnout;
}

type WinStatus = 'Winner' | 'Tied' | 'Lost' | 'No votes';

interface CandidateResult {
    id: number;
    name: string;
    party: string | null;
    photo: string | null;
    votes: number;
    win_rate: number;
    is_winner: boolean;
    status: WinStatus;
}

interface CategoryResult {
    id: number;
    name: string;
    description: string | null;
    total_votes: number;
    winner_count: number;
    is_tie: boolean;
    candidates: CandidateResult[];
}

interface ResultsProps {
    overview: ResultsOverview;
    categories: CategoryResult[];
}

const statusStyles: Record<WinStatus, string> = {
    Winner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    Tied: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    Lost: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    'No votes': 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500',
};

const percent = (value: number) => `${value.toFixed(1)}%`;

export default function Results({ overview, categories }: ResultsProps) {
    const statCards = [
        {
            title: 'Total Votes Cast',
            value: overview.total_votes_cast.toLocaleString(),
            detail: `Across ${categories.length} position${categories.length === 1 ? '' : 's'}`,
        },
        {
            title: 'Voter Turnout',
            value: percent(overview.turnout_rate),
            detail: `${overview.voted_voters} of ${overview.registered_voters} registered voters`,
        },
        {
            title: 'Male Turnout',
            value: percent(overview.male.turnout_rate),
            detail: `${overview.male.voted} of ${overview.male.registered} male voters`,
        },
        {
            title: 'Female Turnout',
            value: percent(overview.female.turnout_rate),
            detail: `${overview.female.voted} of ${overview.female.registered} female voters`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Results" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4"
                        >
                            <div className="text-sm font-medium text-neutral-500">{card.title}</div>
                            <div className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{card.value}</div>
                            <div className="mt-2 text-sm text-neutral-500">{card.detail}</div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 ? (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border p-6 text-center text-sm text-neutral-500">
                        No positions to report on yet.
                    </div>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-700">
                                <div>
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{category.name}</h2>
                                    {category.description && <p className="mt-0.5 text-sm text-neutral-500">{category.description}</p>}
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-neutral-500">Votes cast</div>
                                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{category.total_votes}</div>
                                </div>
                            </div>

                            {category.is_tie && (
                                <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                    Tie: {category.winner_count} candidates share the highest number of votes.
                                </p>
                            )}

                            {category.candidates.length === 0 ? (
                                <p className="mt-4 text-sm text-neutral-500">No candidates registered for this position.</p>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {category.candidates.map((candidate) => (
                                        <div
                                            key={candidate.id}
                                            className={`rounded-lg border p-3 ${
                                                candidate.is_winner
                                                    ? 'border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
                                                    : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">{candidate.name}</span>
                                                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyles[candidate.status]}`}>
                                                            {candidate.status}
                                                        </span>
                                                    </div>
                                                    {candidate.party && <div className="mt-0.5 text-sm text-neutral-500">{candidate.party}</div>}
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">{candidate.votes}</div>
                                                    <div className="text-sm text-neutral-500">{percent(candidate.win_rate)}</div>
                                                </div>
                                            </div>

                                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                                                <div
                                                    className={`h-full rounded-full ${candidate.is_winner ? 'bg-green-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${Math.min(candidate.win_rate, 100)}%` }}
                                                />
                                            </div>
                                            <div className="mt-1 text-xs text-neutral-500">Share of position votes</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </AppLayout>
    );
}