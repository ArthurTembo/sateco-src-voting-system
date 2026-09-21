<?php

namespace Tests\Feature;

use App\Models\Candidate;
use App\Models\Category;
use App\Models\Vote;
use App\Models\Voter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;

class VoteFlowTest extends TestCase
{
    use RefreshDatabase;

    private function makeVoter(): Voter
    {
        return Voter::create([
            'student_id' => '2023-0001',
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'gender' => 'male',
            'course' => 'BSIT',
            'password' => 'AB23CD', // 6-char plain password, like votersImport generates
        ]);
    }

    /**
     * Two categories ("President", "Vice President") with two candidates each.
     *
     * @return array{0: Category, 1: Category}
     */
    private function makeBallot(): array
    {
        $president = Category::create(['name' => 'President', 'description' => 'Student council president']);
        $vice = Category::create(['name' => 'Vice President']);

        Candidate::create(['category_id' => $president->id, 'first_name' => 'Ana', 'last_name' => 'Lim', 'gender' => 'female', 'student_id' => 'CAND-1']);
        Candidate::create(['category_id' => $president->id, 'first_name' => 'Ben', 'last_name' => 'Sy', 'gender' => 'male', 'student_id' => 'CAND-2']);
        Candidate::create(['category_id' => $vice->id, 'first_name' => 'Cara', 'last_name' => 'Reyes', 'gender' => 'female', 'student_id' => 'CAND-3']);
        Candidate::create(['category_id' => $vice->id, 'first_name' => 'Dan', 'last_name' => 'Yu', 'gender' => 'male', 'student_id' => 'CAND-4']);

        return [$president, $vice];
    }

    public function test_login_page_is_publicly_reachable(): void
    {
        $this->get('/vote/login')->assertOk();
    }

    public function test_guest_is_redirected_from_ballot_to_login(): void
    {
        $this->get('/vote/ballot')->assertRedirect(route('vote.login'));
    }

    public function test_voter_can_log_in_with_generated_password(): void
    {
        $this->makeVoter();
        $this->makeBallot();

        $response = $this->post('/vote/login', [
            'student_id' => '2023-0001',
            'password' => 'AB23CD',
        ]);

        $response->assertRedirect(route('vote.ballot'));
        $this->assertNotNull(session('voter_id'));
    }

    public function test_wrong_password_is_rejected(): void
    {
        $this->makeVoter();

        $response = $this->from('/vote/login')->post('/vote/login', [
            'student_id' => '2023-0001',
            'password' => 'WRONG1',
        ]);

        $response->assertRedirect('/vote/login');
        $response->assertSessionHasErrors('student_id');
        $this->assertNull(session('voter_id'));
    }

    public function test_ballot_page_shows_categories_and_candidates(): void
    {
        $voter = $this->makeVoter();
        [$president, $vice] = $this->makeBallot();

        $this->withSession(['voter_id' => $voter->id])
            ->get('/vote/ballot')
            ->assertOk()
            ->assertSee('President')
            ->assertSee('Vice President')
            ->assertSee('Ana');
    }

    public function test_voter_can_submit_ballot_and_sees_thank_you(): void
    {
        $voter = $this->makeVoter();
        [$president, $vice] = $this->makeBallot();

        $presidentCandidates = $president->candidates()->orderBy('id')->pluck('id');
        $viceCandidates = $vice->candidates()->orderBy('id')->pluck('id');

        $response = $this->withSession(['voter_id' => $voter->id])
            ->post('/vote/ballot', [
                'votes' => [
                    $president->id => $presidentCandidates[0],
                    $vice->id => $viceCandidates[1],
                ],
            ]);

        $response->assertRedirect(route('vote.thankyou'));
        $this->assertSame(2, Vote::count());
        $this->assertDatabaseHas('votes', [
            'voter_id' => $voter->id,
            'category_id' => $president->id,
            'candidate_id' => $presidentCandidates[0],
        ]);
        $this->assertTrue((bool) $voter->fresh()->has_voted);
    }

    public function test_incomplete_ballot_is_rejected(): void
    {
        $voter = $this->makeVoter();
        [$president, $vice] = $this->makeBallot();

        $response = $this->withSession(['voter_id' => $voter->id])
            ->post('/vote/ballot', [
                'votes' => [
                    $president->id => $president->candidates()->first()->id,
                ],
            ]);

        $response->assertSessionHasErrors('votes');
        $this->assertSame(0, Vote::count());
        $this->assertFalse((bool) $voter->fresh()->has_voted);
    }

    public function test_voted_voter_is_sent_to_already_voted_page(): void
    {
        $voter = $this->makeVoter();
        [$president, $vice] = $this->makeBallot();

        $this->withSession(['voter_id' => $voter->id])
            ->post('/vote/ballot', [
                'votes' => [
                    $president->id => $president->candidates()->first()->id,
                    $vice->id => $vice->candidates()->first()->id,
                ],
            ]);

        $this->withSession(['voter_id' => $voter->id])
            ->get('/vote/ballot')
            ->assertRedirect(route('vote.already.voted'));

        $this->get('/vote/already-voted')->assertOk();
    }
}
