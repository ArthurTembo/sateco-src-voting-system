<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\candidateImport;
use App\Models\Candidate;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\Rule;

class CandidateController extends Controller
{
    public function index()
    {
        $candidates = Candidate::with('category')->orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/candidates/index', [
            'candidates' => $candidates,
        ]);
    }

    public function create()
    {
        $categories = \App\Models\Category::orderBy('name')->get(['id','name']);

        return Inertia::render('admin/candidates/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'max:50'],
            'category_id' => ['required', 'integer'],
            'party' => ['nullable', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:191'],
        ]);

        $payload = [
            'first_name' => trim($data['first_name']),
            'middle_name' => !empty(trim((string) ($data['middle_name'] ?? ''))) ? trim($data['middle_name']) : null,
            'last_name' => trim($data['last_name']),
            'gender' => trim($data['gender']),
            'category_id' => $data['category_id'],
            'party' => $data['party'] ?? null,
            'student_id' => $data['student_id'] ?? (string) Str::uuid(),
        ];

        // Prevent the same person from being a candidate for the same position twice.
        // Check by `student_id` if provided, otherwise fall back to name matching.
        $existingQuery = Candidate::where('category_id', $payload['category_id']);
        if (!empty($payload['student_id'])) {
            $existingQuery->where('student_id', $payload['student_id']);
        } else {
            $existingQuery->where('first_name', $payload['first_name'])
                ->where('last_name', $payload['last_name']);
            if (!empty($payload['middle_name'])) {
                $existingQuery->where('middle_name', $payload['middle_name']);
            }
        }

        if ($existingQuery->exists()) {
            return redirect()->back()
                ->withErrors(['duplicate' => 'This person is already registered for that position.'])
                ->withInput();
        }

        Log::info('candidate.create.payload', $payload);
        Candidate::create($payload);

        return redirect()->route('admin.candidates.index');
    }

    public function import(Request $request)
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv'],
        ]);

        $import = new candidateImport();
        Excel::import($import, $data['file']);

        return redirect()->back()->with('success', 'Imported ' . $import->getImportedCount() . ' candidates.');
    }

    public function show(Candidate $candidate)
    {
        $candidate->load('category');

        return Inertia::render('admin/candidates/show', [
            'candidate' => $candidate,
        ]);
    }

    public function edit(Candidate $candidate)
    {
        $categories = \App\Models\Category::orderBy('name')->get(['id','name']);

        return Inertia::render('admin/candidates/edit', [
            'candidate' => $candidate,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Candidate $candidate)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'max:50'],
            'category_id' => ['required', 'integer'],
            'party' => ['nullable', 'string', 'max:255'],
            'student_id' => ['required', 'string', 'max:191'],
        ]);

        $payload = [
            'first_name' => trim($data['first_name']),
            'middle_name' => !empty(trim((string) ($data['middle_name'] ?? ''))) ? trim($data['middle_name']) : null,
            'last_name' => trim($data['last_name']),
            'gender' => trim($data['gender']),
            'category_id' => $data['category_id'],
            'party' => $data['party'] ?? null,
            'student_id' => $data['student_id'] ?? $candidate->student_id,
        ];

        $candidate->update($payload);

        return redirect()->route('admin.candidates.index');
    }

    public function destroy(Candidate $candidate)
    {
        $candidate->delete();

        return redirect()->route('admin.candidates.index');
    }
}
