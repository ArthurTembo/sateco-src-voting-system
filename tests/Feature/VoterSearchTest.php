<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Voter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;
use Inertia\Testing\AssertableInertia;

class VoterSearchTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Three voters with distinct student IDs and names, so every search term
     * used below can only match one of them.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->actingAs(User::factory()->create());

        $voters = [
            ['2023-0001', 'Juan', 'Reyes', 'Dela Cruz'],
            ['2023-0002', 'Maria', null, 'Santos'],
            ['2023-0003', 'Pedro', 'Bautista', 'Ramirez'],
        ];

        foreach ($voters as [$studentId, $firstName, $middleName, $lastName]) {
            Voter::create([
                'student_id' => $studentId,
                'first_name' => $firstName,
                'middle_name' => $middleName,
                'last_name' => $lastName,
                'gender' => 'male',
                'course' => 'BSIT',
                'password' => 'ABC123',
            ]);
        }
    }

    public function test_index_lists_every_voter_when_no_search_term_is_given(): void
    {
        $this->get(route('admin.voters.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('voters', 3)
                ->where('filters.search', ''));
    }

    public function test_search_filters_the_list_by_student_id(): void
    {
        $this->get(route('admin.voters.index', ['search' => '2023-0002']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('voters', 1)
                ->where('filters.search', '2023-0002')
                ->where('voters.0.student_id', '2023-0002'));
    }

    public function test_search_filters_the_list_by_surname_regardless_of_case(): void
    {
        $this->get(route('admin.voters.index', ['search' => 'santos']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('voters', 1)
                ->where('voters.0.student_id', '2023-0002'));
    }

    public function test_search_filters_the_list_by_first_name(): void
    {
        $this->get(route('admin.voters.index', ['search' => 'Pedro']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('voters', 1)
                ->where('voters.0.student_id', '2023-0003'));
    }

    public function test_search_matches_a_full_name_split_across_columns_in_any_order(): void
    {
        foreach (['juan dela', 'dela juan'] as $term) {
            $this->get(route('admin.voters.index', ['search' => $term]))
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page
                    ->has('voters', 1)
                    ->where('voters.0.student_id', '2023-0001'));
        }
    }

    public function test_search_ignores_surrounding_whitespace(): void
    {
        $this->get(route('admin.voters.index', ['search' => '  ramirez  ']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('voters', 1)
                ->where('filters.search', 'ramirez')
                ->where('voters.0.student_id', '2023-0003'));
    }

    public function test_search_returns_an_empty_list_when_nothing_matches(): void
    {
        $this->get(route('admin.voters.index', ['search' => 'nobody-here']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('voters', 0)
                ->where('filters.search', 'nobody-here'));
    }
}
