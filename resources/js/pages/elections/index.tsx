import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Elections', href: '/elections' },
];

const statCards = [
    { title: 'Open Elections', value: '3', detail: 'Currently active' },
    { title: 'Upcoming', value: '2', detail: 'Scheduled soon' },
    { title: 'Total Votes', value: '18.4K', detail: 'Across all elections' },
];

const electionRows = [
    { id: 1, name: 'Student Council', date: 'Sept 12, 2026', status: 'Live' },
    { id: 2, name: 'Club President', date: 'Sept 18, 2026', status: 'Scheduled' },
    { id: 3, name: 'Department Representative', date: 'Sept 24, 2026', status: 'Draft' },
];

export default function Elections() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Elections" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border p-4 md:min-h-min">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-700">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Election Overview</h2>
                        <span className="text-sm text-neutral-500">As of today</span>
                    </div>

                    <div className="mt-4 space-y-3">
                        {electionRows.map((election) => (
                            <div
                                key={election.id}
                                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900"
                            >
                                <div>
                                    <div className="font-medium text-neutral-900 dark:text-neutral-100">{election.name}</div>
                                    <div className="text-sm text-neutral-500">{election.date}</div>
                                </div>
                                <span
                                    className={
                                        election.status === 'Live'
                                            ? 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : election.status === 'Scheduled'
                                                ? 'rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'rounded-full bg-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                                    }
                                >
                                    {election.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}