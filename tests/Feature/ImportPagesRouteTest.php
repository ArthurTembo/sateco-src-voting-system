<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;

class ImportPagesRouteTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Regression test: "GET admin/voters/import" used to be swallowed by the
     * resource route "GET admin/voters/{voter}" (registered before the custom
     * import route), so the {voter} wildcard bound the string "import",
     * route-model binding failed, and the page 404'd.
     */
    public function test_voters_import_form_is_reachable_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/admin/voters/import');

        $response->assertOk();
    }

    /**
     * Same class of bug existed for the categories import form.
     */
    public function test_categories_import_form_is_reachable_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/admin/categories/import');

        $response->assertOk();
    }
}
