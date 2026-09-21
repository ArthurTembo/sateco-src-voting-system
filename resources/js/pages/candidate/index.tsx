import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Candidate', href: '/candidate' },
];

const candidateMenu = [
    {
        id: 1,
        title: 'Create Category',
        description: 'Set up new candidate categories for upcoming elections.',
        route: 'admin.categories.create',
        buttonText: '+ New Category',
    },
    {
        id: 2,
        title: 'Add Candidate',
        description: 'Register a new candidate and assign them to a category.',
        route: 'admin.candidates.create',
        buttonText: '+ New Candidate',
    },
    {
        id: 3,
        title: 'View Candidates',
        description: 'Review all listed candidates and their current status.',
        route: 'admin.candidates.index',
        buttonText: 'View Candidates',
    },
];

export default function Candidate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidate" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Candidate</h1>
                        <p className="text-sm text-neutral-500 mt-1">Manage categories and candidates for upcoming elections.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('admin.candidates.index')} className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                            Manage Candidates
                        </Link>
                        <Link href={route('admin.categories.index')} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Manage Categories
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {candidateMenu.map((item) => (
                        <div key={item.id} className="overflow-hidden rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-semibold text-blue-600">Candidate</div>
                                <span className="text-xs text-neutral-500">Action</span>
                            </div>

                            <h3 className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{item.title}</h3>
                            <p className="mt-2 text-sm text-neutral-500">{item.description}</p>

                            <div className="mt-4">
                                <Link href={route(item.route)} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                    {item.buttonText}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Candidate Overview</h2>
                        <span className="text-sm text-neutral-500">Status summary</span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                        {[{ label: 'Categories', value: '4' }, { label: 'Male candidates', value: '9' }, { label: 'Female candidates', value: '9' }, { label: 'Total candidates', value: '18' }].map((stat) => (
                            <div key={stat.label} className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800">
                                <div className="text-sm text-neutral-500">{stat.label}</div>
                                <div className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}