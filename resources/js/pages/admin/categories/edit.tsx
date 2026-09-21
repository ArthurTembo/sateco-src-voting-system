import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories', href: '/admin/categories' }];

export default function CategoryEdit() {
    const { category } = usePage<any>().props;
    const { data, setData, patch, processing, errors } = useForm({ name: category.name ?? '', description: category.description ?? '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.categories.update', category.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />

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

                <button type="submit" disabled={processing} className="rounded bg-blue-600 px-3 py-2 text-white">Save</button>
            </form>
        </AppLayout>
    );
}
