import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/admin/users' }];

export default function UserShow() {
    const { user } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user?.name ?? 'User'} />

            <div>
                <h1 className="text-2xl font-semibold">{user?.name}</h1>
                <p className="text-sm text-neutral-500 mt-2">{user?.username} — {user?.email}</p>

                <div className="mt-4">
                    <Link href={route('admin.users.edit', user.id)} className="rounded bg-blue-600 px-3 py-2 text-white">Edit</Link>
                </div>
            </div>
        </AppLayout>
    );
}
