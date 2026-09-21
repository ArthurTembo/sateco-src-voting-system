<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Candidate;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VoterController extends Controller
{
    /**
     * Show the voter login page.
     */
    public function showLogin(): Response|RedirectResponse
    {
        if ($voter = $this->currentVoter()) {
            return $this->redirectAfterLogin($voter);
        }

        return Inertia::render('vote/Login');
    }

    /**
     * Authenticate a voter with their student ID and the generated password.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'student_id' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $voter = Voter::where('student_id', $credentials['student_id'])->first();

        // Passwords are stored in plain text on purpose (see App\Imports\votersImport).
        if (! $voter || blank($voter->password) || ! hash_equals($voter->password, $credentials['password'])) {
            return back()
                ->withErrors(['student_id' => 'Invalid student ID or password.'])
                ->onlyInput('student_id');
        }

        session(['voter_id' => $voter->id]);

        return $this->redirectAfterLogin($voter);
    }

    /**
     * Sign the voter out of the voting flow.
     */
    public function logout(): RedirectResponse
    {
        session()->forget('voter_id');

        return redirect()->route('vote.login');
    }

    /**
     * Show the ballot with all active candidates grouped by category.
     */
    public function ballot(): Response|RedirectResponse
    {
        $voter = $this->currentVoter();

        if (! $voter) {
            return redirect()->route('vote.login');
        }

        if ($this->hasVoted($voter)) {
            return redirect()->route('vote.already.voted');
        }

        $categories = Category::query()
            ->with(['candidates' => fn ($query) => $query->where('is_active', true)->orderBy('last_name')])
            ->orderBy('name')
            ->get();

        return Inertia::render('vote/Ballot', [
            'voter' => [
                'id' => $voter->id,
                'name' => trim($voter->first_name.' '.($voter->middle_name ? $voter->middle_name.' ' : '').$voter->last_name),
                'student_id' => $voter->student_id,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Store the submitted ballot: one vote per category, then mark done.
     */
    public function submitBallot(Request $request): RedirectResponse
    {
        $voter = $this->currentVoter();

        if (! $voter) {
            return redirect()->route('vote.login');
        }

        if ($this->hasVoted($voter)) {
            return redirect()->route('vote.already.voted');
        }

        $data = $request->validate([
            'votes' => ['required', 'array', 'min:1'],
            'votes.*' => ['required', 'integer'],
        ]);

        $candidateIds = collect($data['votes'])->unique()->values();

        // Every submitted candidate must exist and be active; the category of
        // the vote is derived from the candidate itself, so a forged
        // category/candidate pairing is neutralized.
        $candidates = Candidate::whereIn('id', $candidateIds)
            ->where('is_active', true)
            ->get()
            ->keyBy('id');

        $categoryCount = Category::whereHas('candidates', fn ($query) => $query->where('is_active', true))->count();

        $coversEveryCategory = $candidates->pluck('category_id')->unique()->count() === $categoryCount
            && $categoryCount > 0;

        if ($candidates->count() !== $candidateIds->count() || ! $coversEveryCategory) {
            return back()->withErrors(['votes' => 'Please select one candidate for every category.']);
        }

        // Record the votes and keep `candidates.votes_count` in step with them.
        // Both happen in one transaction so the running tally can never drift
        // away from the actual vote rows if one of the writes fails.
        DB::transaction(function () use ($candidates, $voter) {
            foreach ($candidates as $candidate) {
                $vote = Vote::firstOrCreate([
                    'voter_id' => $voter->id,
                    'category_id' => $candidate->category_id,
                    'candidate_id' => $candidate->id,
                ]);

                // Only tally genuinely new votes: a re-submitted ballot must not
                // add the same vote to the counter twice.
                if ($vote->wasRecentlyCreated) {
                    // Atomic `votes_count = votes_count + 1` in SQL, so two
                    // voters voting at the same moment can't overwrite each
                    // other's tally.
                    $candidate->increment('votes_count');
                }
            }

            $voter->forceFill(['has_voted' => true])->save();
        });

        return redirect()->route('vote.thankyou');
    }

    /**
     * Thank-you page after a successful vote.
     */
    public function thankYou(): Response
    {
        return Inertia::render('vote/ThankYou');
    }

    /**
     * Shown when a voter tries to vote a second time.
     */
    public function alreadyVoted(): Response
    {
        return Inertia::render('vote/AlreadyVoted');
    }

    // ----------------------------------------------------------------------

    private function currentVoter(): ?Voter
    {
        $voterId = session('voter_id');

        return $voterId ? Voter::find($voterId) : null;
    }

    private function hasVoted(Voter $voter): bool
    {
        return (bool) $voter->has_voted || Vote::where('voter_id', $voter->id)->exists();
    }

    private function redirectAfterLogin(Voter $voter): RedirectResponse
    {
        return $this->hasVoted($voter)
            ? redirect()->route('vote.already.voted')
            : redirect()->route('vote.ballot');
    }
}
