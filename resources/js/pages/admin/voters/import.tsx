import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Voters', href: '/admin/voters' }];

export default function VotersImport() {
    const { data, setData, post, processing } = useForm({ file: null });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const form = new FormData();
        // @ts-ignore
        form.append('file', data.file);
        post(route('admin.voters.import'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Voters" />

            <div className="border-t pt-6 px-4">
                <h2 className="text-lg font-medium">Import voters from Excel/CSV</h2>
                <p className="mt-1 text-sm text-slate-600">Columns: StudentID, FirstName, MiddleName, LastName, Gender, Course</p>
                <p className="mt-1 text-sm text-slate-600">A unique 6-character password is generated and stored for every imported voter — no password column is needed in the spreadsheet. Existing voters keep their current password.</p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mt-2">File</label>
                        <input type="file" onChange={(e) => setData('file', (e.target as HTMLInputElement).files?.[0])} className="mt-1 block w-full rounded border p-2" />
                    </div>

                    <button type="submit" disabled={processing} className="rounded bg-blue-600 px-3 py-2 text-white">Upload</button>
                </form>
            </div>

        </AppLayout>
    );
}
