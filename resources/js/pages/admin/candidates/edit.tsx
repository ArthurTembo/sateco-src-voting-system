import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Candidates', href: '/admin/candidates' }];

export default function CandidateEdit() {
    const { candidate, categories } = usePage<any>().props;
    const { data, setData, patch, processing, errors } = useForm({
        first_name: candidate.first_name ?? '',
        middle_name: candidate.middle_name ?? '',
        last_name: candidate.last_name ?? '',
        gender: candidate.gender ?? '',
        party: candidate.party ?? '',
        category_id: candidate.category_id ?? '',
        student_id: candidate.student_id ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.candidates.update', candidate.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Candidate" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Student ID</label>
                    <input name="student_id" value={data.student_id} readOnly className="mt-1 block w-full rounded border p-2 bg-gray-50" />
                    {errors.student_id && <div className="text-sm text-red-600">{errors.student_id}</div>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                        {errors.first_name && <div className="text-sm text-red-600">{errors.first_name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Middle Name</label>
                        <input value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                        {errors.middle_name && <div className="text-sm text-red-600">{errors.middle_name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                        {errors.last_name && <div className="text-sm text-red-600">{errors.last_name}</div>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Gender</label>
                    <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className="mt-1 block w-full rounded border p-2">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    {errors.gender && <div className="text-sm text-red-600">{errors.gender}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Category</label>
                    <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="mt-1 block w-full rounded border p-2">
                        <option value="">Select a category</option>
                        {categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <div className="text-sm text-red-600">{errors.category_id}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Party</label>
                    <input value={data.party} onChange={(e) => setData('party', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                    {errors.party && <div className="text-sm text-red-600">{errors.party}</div>}
                </div>

                <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white">
                    {processing && (
                        <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    )}
                    Save
                </button>
            </form>
        </AppLayout>
    );
}
