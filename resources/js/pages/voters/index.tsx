import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Voters', href: '/voters' },
];

interface VoterStats {
    total: number;
    male: number;
    female: number;
}

interface VotersProps {
    stats: VoterStats;
}

export default function Voters({ stats }: VotersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Voters" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Voters</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/voters" className="rounded bg-white px-3 py-2 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 border">Manage Voters</Link>
                        <Link href="/admin/voters/create" className="rounded bg-blue-600 px-3 py-2 text-white">Add Voter</Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                        <div className="text-sm font-medium text-neutral-500">Voter</div>
                        <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Add Voter</h3>
                        <p className="mt-2 text-sm text-neutral-500">Register a new voter into the system.</p>
                        <div className="mt-4">
                            <Link href="/admin/voters/create" className="rounded bg-blue-600 px-3 py-2 text-white">+ New Voter</Link>
                        </div>
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                        <div className="text-sm font-medium text-neutral-500">Voter</div>
                        <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Import Voters</h3>
                        <p className="mt-2 text-sm text-neutral-500">Import a list of voters from a spreadsheet.</p>
                        <div className="mt-4">
                            <Link href="/admin/voters/import" className="rounded bg-blue-600 px-3 py-2 text-white">Import</Link>
                        </div>
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4">
                        <div className="text-sm font-medium text-neutral-500">Voter</div>
                        <h3 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">View Voters</h3>
                        <p className="mt-2 text-sm text-neutral-500">Review all registered voters and their current status.</p>
                        <div className="mt-4">
                            <Link href="/admin/voters" className="rounded bg-blue-600 px-3 py-2 text-white">View Voters</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-700">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Voter Overview</h2>
                        <span className="text-sm text-neutral-500">Status summary</span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                                <div className="text-sm text-neutral-500">Total Registered Voters</div>
                                <div className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{stats.total}</div>
                                <div className="mt-1 text-sm text-neutral-500">Eligible to vote</div>
                            </div>
                            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                                <div className="text-sm text-neutral-500">Male</div>
                                <div className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{stats.male}</div>
                                <div className="mt-1 text-sm text-neutral-500">Eligible to vote</div>
                            </div>
                            <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                                <div className="text-sm text-neutral-500">Female</div>
                                <div className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{stats.female}</div>
                                <div className="mt-1 text-sm text-neutral-500">Eligible to vote</div>
                            </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}