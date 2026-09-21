import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Candidates', href: '/admin/candidates' }];

export default function CandidateCreate() {
    const { categories, flash } = usePage<any>().props;
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        party: '',
        category_id: '',
        student_id: '',
    });
    const importForm = useForm<{ file: File | null }>({
        file: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // ensure a student_id is present; generate with crypto.randomUUID() when available
        const id = data.student_id || (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `gen-${Date.now()}`);
        setData('student_id', id);
        // wait one tick to ensure state is applied before posting
        setTimeout(() => post(route('admin.candidates.store')), 0);
    };

    const submitImport: FormEventHandler = (e) => {
        e.preventDefault();
        importForm.post(route('admin.candidates.import'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Candidate" />

            {flash?.success && (
                <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{flash.success}</div>
            )}

            <form onSubmit={submit} className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium">Student ID</label>
                    <div className="mt-1 flex gap-2">
                        <input name="student_id" value={data.student_id} onChange={(e) => setData('student_id', e.target.value)} className="block w-full rounded border p-2" />
                        <button type="button" onClick={() => {
                            const id = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `gen-${Date.now()}`;
                            setData('student_id', id);
                        }} className="px-3 py-2 rounded border">Generate</button>
                    </div>
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
                </div>

                <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white">
                    {processing && (
                        <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    )}
                    Create
                </button>
            </form>

            <div className="mt-8 max-w-xl border-t pt-6">
                <h2 className="text-lg font-medium">Import candidates from Excel/CSV</h2>
                <p className="mt-1 text-sm text-slate-600">Columns: StudentID, FirstName, MiddleName, LastName, Gender, Category, Course</p>

                <form onSubmit={submitImport} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">File</label>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => importForm.setData('file', e.currentTarget.files?.[0] ?? null)}
                            className="mt-1 block w-full rounded border p-2"
                        />
                        {importForm.errors.file && <div className="text-sm text-red-600">{importForm.errors.file}</div>}
                    </div>

                    <button type="submit" disabled={importForm.processing} className="rounded bg-green-600 px-4 py-2 text-white">
                        {importForm.processing ? 'Importing...' : 'Upload and Import'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
