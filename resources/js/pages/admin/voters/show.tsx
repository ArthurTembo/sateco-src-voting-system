import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Voters', href: '/admin/voters' }];

export default function VoterShow() {
    const { voter } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Voter" />

            <div className="space-y-4 pt-6 px-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Voter Details</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/voters" className="rounded border px-3 py-2">Back</Link>
                        <Link href={route('admin.voters.edit', voter.id)} className="rounded bg-blue-600 px-3 py-2 text-white">Edit</Link>
                    </div>
                </div>

                <div className="rounded-lg border p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-neutral-500">Student ID</div>
                            <div className="mt-1 font-medium">{voter.student_id}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Full Name</div>
                            <div className="mt-1 font-medium">{voter.first_name} {voter.middle_name} {voter.last_name}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Gender</div>
                            <div className="mt-1 font-medium">{voter.gender}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Course</div>
                            <div className="mt-1 font-medium">{voter.course}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-500">Has Voted</div>
                            <div className="mt-1 font-medium">{voter.has_voted ? 'Yes' : 'No'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
