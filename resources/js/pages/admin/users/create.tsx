import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/admin/users' }];

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({ username: '', first_name: '', middle_name: '', last_name: '', email: '', password: '', is_super_admin: false });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Username</label>
                    <input value={data.username} onChange={(e) => setData('username', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                    {errors.username && <div className="text-sm text-red-600">{errors.username}</div>}
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <input placeholder="First" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                    <input placeholder="Middle" value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                    <input placeholder="Last" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                </div>

                <div>
                    <label className="inline-flex items-center">
                        <input type="checkbox" checked={data.is_super_admin} onChange={(e) => setData('is_super_admin', e.target.checked)} className="mr-2" />
                        Super Admin
                    </label>
                </div>

                <button type="submit" disabled={processing} className="rounded bg-blue-600 px-3 py-2 text-white">Create</button>
            </form>
        </AppLayout>
    );
}
