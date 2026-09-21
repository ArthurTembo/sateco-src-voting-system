import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories', href: '/admin/categories' }];

export default function CategoriesIndex() {
    const { categories } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Categories</h1>
                    <Link href={route('admin.categories.create')} className="rounded bg-blue-600 px-3 py-2 text-white">New Category</Link>
                </div>

                <div className="space-y-2">
                    {Array.isArray(categories) && categories.length ? (
                        categories.map((c: any) => (
                            <div key={c.id} className="flex items-center justify-between rounded border p-3">
                                <div>
                                    <div className="font-medium">{c.name}</div>
                                    <div className="text-sm text-neutral-500">{c.description}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('admin.categories.show', c.id)} className="text-sm text-blue-600">View</Link>
                                    <Link href={route('admin.categories.edit', c.id)} className="text-sm text-blue-600">Edit</Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-neutral-500">No categories yet.</div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
