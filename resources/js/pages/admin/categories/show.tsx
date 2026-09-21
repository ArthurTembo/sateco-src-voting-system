import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories', href: '/admin/categories' }];

export default function CategoryShow() {
    const { category } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={category?.name ?? 'Category'} />

            <div>
                <h1 className="text-2xl font-semibold">{category?.name}</h1>
                <p className="text-sm text-neutral-500 mt-2">{category?.description}</p>

                <div className="mt-4">
                    <Link href={route('admin.categories.edit', category.id)} className="rounded bg-blue-600 px-3 py-2 text-white">Edit</Link>
                </div>
            </div>
        </AppLayout>
    );
}
