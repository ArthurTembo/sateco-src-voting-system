import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Candidates', href: '/admin/candidates' }];

export default function CandidatesIndex() {
    const { candidates } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidates" />

            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Candidates</h1>
                <Link href={route('admin.candidates.create')} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ New Candidate</Link>
            </div>

            {!candidates ? (
                <div className="space-y-2">
                    <div className="animate-pulse space-y-2">
                        <div className="h-6 w-1/3 rounded bg-neutral-200" />
                        <div className="h-4 w-full rounded bg-neutral-200" />
                        <div className="h-4 w-3/4 rounded bg-neutral-200" />
                    </div>
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2">
                    {candidates.length ? candidates.map((c: any) => (
                        <div key={c.id} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-lg font-semibold">{c.name}</div>
                                    <div className="text-sm text-neutral-500 mt-1">{c.party || '—'}</div>
                                    <div className="text-sm text-neutral-500 mt-2">Category: {c.category?.name ?? 'Unassigned'}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('admin.candidates.show', c.id)} className="text-sm text-blue-600">View</Link>
                                    <Link href={route('admin.candidates.edit', c.id)} className="text-sm text-blue-600">Edit</Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-sm text-neutral-500">No candidates yet.</div>
                    )}
                </div>
            )}
        </AppLayout>
    );
}
