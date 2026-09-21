<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\votersImport;
use App\Models\Voter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class VoterController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * The optional "search" query string parameter filters the list by student
     * ID, first name or surname (see Voter::scopeSearch()).
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $search = trim((string) ($filters['search'] ?? ''));

        // Passwords are stored in plain text on purpose so the admin can
        // distribute them; make them visible for the admin list view.
        $voters = Voter::query()
            ->search($search)
            ->orderBy('created_at', 'desc')
            ->get()
            ->makeVisible('password');

        return Inertia::render('admin/voters/index', [
            'voters' => $voters,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show import form for voters.
     */
    public function showImportForm(): Response
    {
        return Inertia::render('admin/voters/import');
    }

    /**
     * Handle Excel/CSV import and create/update voters.
     */
    public function import(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv'],
        ]);

        $import = new votersImport();
        Excel::import($import, $data['file']);

        return redirect()->route('admin.voters.index')
            ->with('success', 'Imported ' . $import->getImportedCount() . ' voters.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/voters/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'student_id' => ['required', 'string', 'max:255', 'unique:voters,student_id'],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'max:50'],
            'course' => ['nullable', 'string', 'max:255'],
            'has_voted' => ['sometimes', 'boolean'],
        ]);

        $data['password'] = (new votersImport())->generateUniquePassword();

        Voter::create($data);

        return redirect()->route('admin.voters.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Voter $voter): Response
    {
        return Inertia::render('admin/voters/show', [
            'voter' => $voter,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Voter $voter): Response
    {
        return Inertia::render('admin/voters/edit', [
            'voter' => $voter,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Voter $voter): RedirectResponse
    {
        $data = $request->validate([
            'student_id' => ['required', 'string', 'max:255', 'unique:voters,student_id,' . $voter->id],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'max:50'],
            'course' => ['nullable', 'string', 'max:255'],
            'has_voted' => ['sometimes', 'boolean'],
        ]);

        $voter->update($data);

        return redirect()->route('admin.voters.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Voter $voter): RedirectResponse
    {
        $voter->delete();

        return redirect()->route('admin.voters.index');
    }
}
