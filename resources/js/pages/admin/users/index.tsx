import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/admin/users' }];

export default function UsersIndex() {
    const { users } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="mb-4 flex justify-end">
                <Link href={route('admin.users.create')} className="rounded bg-blue-600 px-3 py-2 text-white">New User</Link>
            </div>

            <div className="space-y-2">
                {users?.map((u: any) => (
                    <div key={u.id} className="rounded border p-4">
                        <h3 className="text-lg font-medium">{u.name}</h3>
                        <p className="text-sm text-neutral-500">{u.username} — {u.email}</p>
                        <div className="mt-2">
                            <Link href={route('admin.users.show', u.id)} className="text-blue-600">View</Link>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
