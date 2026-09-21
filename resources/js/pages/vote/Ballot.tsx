import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Candidate {
    id: number;
    name: string;
    party?: string | null;
    course?: string | null;
    year_level?: string | null;
}

interface Category {
    id: number;
    name: string;
    description?: string | null;
    candidates: Candidate[];
}

interface BallotProps {
    voter: { id: number; name: string; student_id: string };
    categories: Category[];
}

export default function Ballot({ voter, categories }: BallotProps) {
    const { data, setData, post, processing, errors } = useForm<{ votes: Record<string, number> }>({
        votes: {},
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('vote.ballot.submit'));
    };

    return (
        <>
            <Head title="Official Ballot" />
            <div className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950">
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    <header className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h1 className="text-2xl">{voter.name}</h1>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Student ID: <span className="font-medium">{voter.student_id}</span>
                                </p>
                            </div>
                            <Link
                                href={route('vote.logout')}
                                method="post"
                                as="button"
                                className="rounded border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                            >
                                Sign out
                            </Link>
                        </div>
                    </header>

                    <form onSubmit={submit} className="space-y-6">
                        {categories.map((category) => (
                            <section
                                key={category.id}
                                className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="border-b border-neutral-200 bg-neutral-100 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                                    <h2 className="text-lg font-semibold">{category.name}</h2>
                                    {category.description && (
                                        <p className="mt-1 text-sm text-neutral-500">{category.description}</p>
                                    )}
                                </div>

                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {category.candidates.map((candidate) => {
                                        const selected = data.votes[category.id] === candidate.id;
                                        const meta = [candidate.party, candidate.course, candidate.year_level]
                                            .filter(Boolean)
                                            .join(' • ');

                                        return (
                                            <label
                                                key={candidate.id}
                                                className={`flex cursor-pointer items-center gap-4 px-6 py-4 ${
                                                    selected
                                                        ? 'bg-blue-50 dark:bg-blue-950/40'
                                                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`category_${category.id}`}
                                                    className="h-4 w-4 accent-blue-600"
                                                    checked={selected}
                                                    onChange={() => setData('votes', { ...data.votes, [category.id]: candidate.id })}
                                                />
                                                <div>
                                                    <div className="font-medium">{candidate.name}</div>
                                                    {meta && <div className="mt-0.5 text-sm text-neutral-500">{meta}</div>}
                                                </div>
                                            </label>
                                        );
                                    })}

                                    {category.candidates.length === 0 && (
                                        <p className="px-6 py-4 text-sm text-neutral-500">No candidates available.</p>
                                    )}
                                </div>
                            </section>
                        ))}

                        {categories.length === 0 && (
                            <p className="rounded-lg border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                                There are no positions to vote on yet.
                            </p>
                        )}

                        <InputError message={errors.votes} />

                        <div className="flex items-center justify-end gap-3">
                            <Label className="text-sm text-neutral-500">
                                {Object.keys(data.votes).length} of {categories.length} selected
                            </Label>
                            <Button type="submit" disabled={processing || categories.length === 0}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Submit Ballot
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

