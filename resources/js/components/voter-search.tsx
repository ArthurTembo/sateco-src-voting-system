import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';

/** How long typing must pause before the voters list is filtered again. */
const DEBOUNCE_MS = 300;

interface VoterSearchProps {
    /** Term the server is currently filtering by (the page's `filters.search` prop). */
    initialSearch?: string;
    className?: string;
}

/**
 * Search box for the admin voters list.
 *
 * Typing is debounced and the term is then sent to the voters index as a
 * `search` query string parameter, which the controller matches against the
 * student ID, the first name and the surname. Submitting the form (Enter or the
 * Search button) skips the debounce, and clearing the box drops the parameter
 * again so the full list comes back.
 */
export default function VoterSearch({ initialSearch = '', className }: VoterSearchProps) {
    const [search, setSearch] = useState(initialSearch);
    const appliedSearch = initialSearch.trim();
    const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applySearch = useCallback((term: string) => {
        // An empty term means "no filter": drop the parameter entirely so the
        // URL and the browser history stay clean.
        router.get(
            route('admin.voters.index'),
            term === '' ? {} : { search: term },
            {
                only: ['voters', 'filters'],
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    }, []);

    // Filter as the admin types. The guard skips the first render and the
    // response that echoes the applied term back, so this can never loop.
    useEffect(() => {
        const term = search.trim();

        if (term === appliedSearch) {
            return;
        }

        debounce.current = setTimeout(() => applySearch(term), DEBOUNCE_MS);

        return () => {
            if (debounce.current !== null) {
                clearTimeout(debounce.current);
                debounce.current = null;
            }
        };
    }, [search, appliedSearch, applySearch]);

    /** Drop the pending debounced request: the caller sends the term itself. */
    const cancelPendingSearch = () => {
        if (debounce.current !== null) {
            clearTimeout(debounce.current);
            debounce.current = null;
        }
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        cancelPendingSearch();

        const term = search.trim();

        if (term !== appliedSearch) {
            applySearch(term);
        }
    };

    const clear = () => {
        cancelPendingSearch();
        setSearch('');

        if (appliedSearch !== '') {
            applySearch('');
        }
    };

    return (
        <form role="search" onSubmit={submit} className={cn('flex flex-wrap items-center gap-2', className)}>
            <div className="relative w-full sm:max-w-sm">
                <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                <Input
                    type="text"
                    name="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by student ID, first name or surname"
                    aria-label="Search voters by student ID, first name or surname"
                    autoComplete="off"
                    className="pl-9"
                />
            </div>

            <Button type="submit" variant="secondary">
                Search
            </Button>

            {(search !== '' || appliedSearch !== '') && (
                <Button type="button" variant="ghost" onClick={clear}>
                    Clear
                </Button>
            )}
        </form>
    );
}
