import AppLayout from '@/layouts/app-layout';
import VoterSearch from '@/components/voter-search';
import { Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Voters', href: '/admin/voters' }];

interface Voter {
    id: number;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    course: string | null;
    has_voted: boolean;
    password: string | null;
}

export default function VotersIndex() {
    const { voters, filters } = usePage<any>().props;

    const search: string = filters?.search ?? '';
    const voterList: Voter[] = voters ?? [];
    const summary =
        search === ''
            ? `${voterList.length} registered voter${voterList.length === 1 ? '' : 's'}`
            : `${voterList.length} result${voterList.length === 1 ? '' : 's'} for "${search}"`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Voters" />
            <div className="pt-6 px-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Manage Voters</h1>
                        <p className="text-sm text-neutral-500">{summary}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">    
                        <Link href={route('admin.voters.create')} className="rounded bg-blue-600 px-3 py-2 text-white">+ New Voter</Link>
                    </div>
                </div>
                <div className="mb-4">
                    <VoterSearch initialSearch={search} />
                </div>

                <div className="space-y-2">
                    {voterList.map((v: Voter) => (
                        <div key={v.id} className="rounded border p-4 space-between flex justify-between items-start">
                            <div className="w-fit">
                                <h3 className="text-lg font-medium">{v.first_name} {v.middle_name} {v.last_name}</h3>
                                <p className="text-sm text-neutral-500">{v.student_id} — {v.course}</p>
                                <p>Password: {v.password}</p>
                            </div>

                            <div className="mt-2 gap-3 w-fit">
                                <div className="flex gap-2">
                                    <Link href={route('admin.voters.show', v.id)} className="text-blue-600">View</Link>
                                    <Link href={route('admin.voters.edit', v.id)} className="text-blue-600">Edit</Link>
                                </div>
                                <div>
                                    {v.has_voted ? (
                                        <span className="text-green-600">Voted</span>
                                    ) : (
                                        <span className="text-red-600">Not Voted</span>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}

                    {voterList.length === 0 && (
                        <div className="rounded border p-4 text-sm text-neutral-500">
                            {search === '' ? 'No voters yet.' : `No voters match "${search}".`}
                        </div>
                    )}
                </div>

            </div>
            
        </AppLayout>
    );
}
