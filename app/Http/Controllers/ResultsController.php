<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Category;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ResultsController extends Controller
{
    /**
     * Live results: turnout overview plus a ranked breakdown per position.
     */
    public function index(): Response
    {
        return Inertia::render('results/index', [
            'overview' => $this->overview(),
            'categories' => $this->categoryResults(),
        ]);
    }

    /**
     * Turnout figures. Registered and voted counts are grouped by gender, so the
     * whole overview costs a single query instead of one per figure.
     *
     * @return array<string, mixed>
     */
    private function overview(): array
    {
        $buckets = Voter::query()
            ->selectRaw('LOWER(gender) as gender_bucket')
            ->selectRaw('COUNT(*) as registered')
            ->selectRaw('SUM(has_voted) as voted')
            ->groupBy('gender_bucket')
            ->get();

        $registered = (int) $buckets->sum('registered');
        $voted = (int) $buckets->sum('voted');

        return [
            'total_votes_cast' => Vote::count(),
            'registered_voters' => $registered,
            'voted_voters' => $voted,
            'turnout_rate' => $this->rate($voted, $registered),
            'male' => $this->genderTurnout($buckets, 'male'),
            'female' => $this->genderTurnout($buckets, 'female'),
        ];
    }

    /**
     * @param  Collection<int, Voter>  $buckets
     * @return array{registered: int, voted: int, turnout_rate: float}
     */
    private function genderTurnout(Collection $buckets, string $gender): array
    {
        $bucket = $buckets->firstWhere('gender_bucket', $gender);

        $registered = (int) ($bucket->registered ?? 0);
        $voted = (int) ($bucket->voted ?? 0);

        return [
            'registered' => $registered,
            'voted' => $voted,
            'turnout_rate' => $this->rate($voted, $registered),
        ];
    }

    /**
     * Candidates grouped per position, ranked by votes, with the winner flagged.
     * `win_rate` is the candidate's share of the votes cast for that position.
     *
     * @return Collection<int, array<string, mixed>>
     */
    private function categoryResults(): Collection
    {
        return Category::query()
            ->with(['candidates' => fn ($query) => $query->orderByDesc('votes_count')->orderBy('last_name')])
            ->orderBy('name')
            ->get()
            ->map(function (Category $category) {
                $candidates = $category->candidates->map(fn (Candidate $candidate) => [
                    'id' => $candidate->id,
                    'name' => $candidate->name,
                    'party' => $candidate->party,
                    'photo' => $candidate->photo,
                    'votes' => (int) $candidate->votes_count,
                ]);

                $totalVotes = (int) $candidates->sum('votes');
                $topVotes = (int) ($candidates->max('votes') ?? 0);
                $winnerCount = $topVotes > 0 ? $candidates->where('votes', $topVotes)->count() : 0;

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'total_votes' => $totalVotes,
                    'winner_count' => $winnerCount,
                    'is_tie' => $winnerCount > 1,
                    'candidates' => $candidates->map(fn (array $candidate) => $candidate + [
                        'win_rate' => $this->rate($candidate['votes'], $totalVotes),
                        'is_winner' => $topVotes > 0 && $candidate['votes'] === $topVotes,
                        'status' => $this->status($candidate['votes'], $topVotes, $winnerCount),
                    ])->values(),
                ];
            })
            ->values();
    }

    /**
     * Win status for a single candidate within its position.
     */
    private function status(int $votes, int $topVotes, int $winnerCount): string
    {
        // A candidate nobody voted for is reported as such, even when the
        // position itself was contested.
        if ($votes === 0) {
            return 'No votes';
        }

        if ($votes !== $topVotes) {
            return 'Lost';
        }

        return $winnerCount > 1 ? 'Tied' : 'Winner';
    }

    /**
     * Percentage of $total that $part represents, to one decimal place.
     */
    private function rate(int $part, int $total): float
    {
        return $total > 0 ? round($part / $total * 100, 1) : 0.0;
    }
}