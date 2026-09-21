import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Candidates', href: '/admin/candidates' }];

export default function CandidateShow() {
    const { candidate } = usePage<any>().props;

    if (!candidate) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Loading..." />
                <div className="animate-pulse">
                    <div className="h-6 w-1/3 rounded bg-neutral-200" />
                    <div className="mt-3 h-4 w-full rounded bg-neutral-200" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={candidate?.name ?? 'Candidate'} />

            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{candidate?.name}</h1>
                        <div className="text-sm text-neutral-500 mt-1">{candidate?.party || '—'}</div>
                        <div className="text-sm text-neutral-500 mt-2">Category: {candidate?.category?.name ?? 'Unassigned'}</div>
                    </div>

                    <div className="flex gap-2">
                        <Link href={route('admin.candidates.edit', candidate.id)} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Edit</Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
