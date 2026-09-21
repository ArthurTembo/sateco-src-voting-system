<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\CategoryImport;

class CategoryController extends Controller
{
	/**
	 * Display a listing of categories.
	 */
	public function index()
	{
		$categories = Category::orderBy('created_at', 'desc')->get();

		return Inertia::render('admin/categories/index', [
			'categories' => $categories,
		]);
	}

	/**
	 * Show the form for creating a new category.
	 */
	public function create()
	{
		return Inertia::render('admin/categories/create');
	}

	/**
	 * Show simple upload form for importing categories via Excel.
	 */
	public function showImportForm()
	{
		return view('admin.categories.import');
	}

	/**
	 * Handle Excel import and create categories.
	 */
	public function import(Request $request)
	{
		$data = $request->validate([
			'file' => ['required','file','mimes:xlsx,xls,csv'],
		]);

		$import = new CategoryImport();
		Excel::import($import, $data['file']);
		$count = $import->getImportedCount();

		return redirect()->back()->with('success', "Imported {$count} categories.");
	}

	/**
	 * Store a newly created category in storage.
	 */
	public function store(Request $request)
	{
		$data = $request->validate([
			'name' => ['required', 'string', 'max:255', Rule::unique(Category::class)],
			'description' => ['nullable', 'string'],
		]);

		$category = Category::create($data);

		return redirect()->route('admin.categories.index');
	}

	/**
	 * Display the specified category.
	 */
	public function show(Category $category)
	{
		return Inertia::render('admin/categories/show', [
			'category' => $category,
		]);
	}

	/**
	 * Show the form for editing the specified category.
	 */
	public function edit(Category $category)
	{
		return Inertia::render('admin/categories/edit', [
			'category' => $category,
		]);
	}

	/**
	 * Update the specified category in storage.
	 */
	public function update(Request $request, Category $category)
	{
		$data = $request->validate([
			'name' => ['required', 'string', 'max:255', Rule::unique(Category::class)->ignore($category->id)],
			'description' => ['nullable', 'string'],
		]);

		$category->update($data);

		return redirect()->route('admin.categories.index');
	}

	/**
	 * Remove the specified category from storage.
	 */
	public function destroy(Category $category)
	{
		$category->delete();

		return redirect()->route('admin.categories.index');
	}
}
