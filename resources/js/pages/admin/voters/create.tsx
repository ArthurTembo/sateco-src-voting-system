import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Voters', href: '/admin/voters' }];

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({ student_id: '', first_name: '', middle_name: '', last_name: '', gender: '', course: '', has_voted: false });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.voters.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <form onSubmit={submit} className="space-y-4 border-t pt-6 px-4">
                <div>
                    <label className="block text-sm font-medium">Student ID</label>
                    <input value={data.student_id} onChange={(e) => setData('student_id', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                    {errors.student_id && <div className="text-sm text-red-600">{errors.student_id}</div>}
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <input placeholder="First" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                    <input placeholder="Middle" value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                    <input placeholder="Last" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-sm font-medium">Gender</label>
                        <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className="mt-1 block w-full rounded border p-2">
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Course</label>
                        <input value={data.course} onChange={(e) => setData('course', e.target.value)} className="mt-1 block w-full rounded border p-2" />
                    </div>
                </div>

                <button type="submit" disabled={processing} className="rounded bg-blue-600 px-3 py-2 text-white">Create Voter</button>
            </form>
        </AppLayout>
    );
}
