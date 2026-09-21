import { Head, Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

export default function AlreadyVoted() {
    return (
        <>
            <Head title="Already Voted" />

            <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
                <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
                    <AlertCircle className="mx-auto h-14 w-14 text-amber-500" />
                    <h1 className="mt-4 text-2xl font-semibold">You have already voted</h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        Our records show that this student ID has already cast a ballot. Each voter may only vote once.
                    </p>
                    <Link
                        href={route('vote.logout')}
                        method="post"
                        as="button"
                        className="mt-6 w-full rounded bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
                    >
                        Sign out
                    </Link>
                    <Link
                        href={route('home')}
                        className="mt-2 block w-full rounded border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </>
    );
}

