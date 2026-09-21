import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories', href: '/admin/categories' }];

export default function CategoryCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '', description: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'));
    };

    const page = usePage();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />

            {page.props?.flash?.success && (
                <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-green-800">{page.props.flash.success}</div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                    {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                </div>

                <button type="submit" disabled={processing} className="rounded bg-blue-600 px-3 py-2 text-white">Create</button>
            </form>


            <div className="mt-8 max-w-xl border-t pt-6">
                <h2 className="text-lg font-medium">Import categories from Excel/CSV</h2>
                <p className="mt-1 text-sm text-slate-600">Columns: Name, Description</p>
                {/* Separate form state for file upload */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {/**/}
                {
                    (() => {
                        const { data: uploadData, setData: setUploadData, post: uploadPost, processing: uploading, errors: uploadErrors } = useForm<any>({ file: null });

                        const uploadSubmit: FormEventHandler = (e) => {
                            e.preventDefault();
                            uploadPost(route('admin.categories.import'), { forceFormData: true });
                        };

                        return (
                            <form onSubmit={uploadSubmit} className="space-y-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium">File</label>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={(e) => setUploadData('file', e.currentTarget.files?.[0] ?? null)}
                                        className="mt-1 block w-full rounded border p-2"
                                    />
                                    {uploadErrors.file && <div className="text-sm text-red-600">{uploadErrors.file}</div>}
                                </div>

                                <button type="submit" disabled={uploading} className="rounded bg-green-600 px-3 py-2 text-white">
                                    Upload and Import
                                </button>
                            </form>
                        );
                    })()
                }
            </div>
            
        </AppLayout>
    );
}
