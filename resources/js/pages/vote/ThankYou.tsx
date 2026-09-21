import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

export default function ThankYou() {
    return (
        <>
            <Head title="Thank You" />

            <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
                <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
                    <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
                    <h1 className="mt-4 text-2xl font-semibold">Thank you for voting!</h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        Your ballot has been recorded successfully. You may now safely sign out.
                    </p>
                    <Link
                        href={route('vote.logout')}
                        method="post"
                        as="button"
                        className="mt-6 w-full rounded bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
                    >
                        Sign out
                    </Link>
                </div>
            </div>
        </>
    );
}

