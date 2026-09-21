<?php

use App\Models\Voter;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('candidate', function () {
        return Inertia::render('candidate/index');
    })->name('candidate');

    Route::get('candidate/createCategory', function () {
        return Inertia::render('candidate/createCategory');
    })->name('candidate.createCategory');

    Route::get('candidate/addCandidate', function () {
        return Inertia::render('candidate/addCandidate');
    })->name('candidate.addCandidate');

    Route::get('candidate/viewCandidates', function () {
        return Inertia::render('candidate/viewCandidates');
    })->name('candidate.viewCandidates');

    Route::get('elections', function () {
        return Inertia::render('elections/index');
    })->name('elections');

    Route::get('voters', function () {
        return Inertia::render('voters/index', [
            'stats' => Voter::overviewStats(),
        ]);
    })->name('voters');

    Route::get('results', [App\Http\Controllers\ResultsController::class, 'index'])->name('results');
    
        // Admin resource routes
        //
        // NOTE: custom routes that share a URI prefix with a resource (e.g. "admin/voters/import")
        // MUST be declared BEFORE Route::resource(). The resource registers GET
        // admin/voters/{voter} (show), which would otherwise capture "import" as the
        // {voter} wildcard, fail route-model binding, and throw a 404 Page Not Found.
        Route::get('admin/categories/import', [App\Http\Controllers\Admin\CategoryController::class, 'showImportForm'])->name('admin.categories.import.form');
        Route::post('admin/categories/import', [App\Http\Controllers\Admin\CategoryController::class, 'import'])->name('admin.categories.import');
        Route::resource('admin/categories', App\Http\Controllers\Admin\CategoryController::class)->names('admin.categories');

        Route::post('admin/candidates/import', [App\Http\Controllers\Admin\CandidateController::class, 'import'])->name('admin.candidates.import');
        Route::resource('admin/candidates', App\Http\Controllers\Admin\CandidateController::class)->names('admin.candidates');

        Route::resource('admin/users', App\Http\Controllers\Admin\UserController::class)->names('admin.users');

        Route::get('admin/voters/import', [App\Http\Controllers\Admin\VoterController::class, 'showImportForm'])->name('admin.voters.import.form');
        Route::post('admin/voters/import', [App\Http\Controllers\Admin\VoterController::class, 'import'])->name('admin.voters.import');
        Route::resource('admin/voters', App\Http\Controllers\Admin\VoterController::class)->names('admin.voters');
});

// Voter (student) voting flow — separate session-based auth from the admin `auth` guard.
// The group prefix "vote/" and name prefix "vote." apply automatically, so the
// inner route names must NOT repeat the "vote." prefix (e.g. name('login') becomes "vote.login").
Route::prefix('vote')->name('vote.')->group(function () {
    Route::get('login', [App\Http\Controllers\VoterController::class, 'showLogin'])->name('login');
    Route::post('login', [App\Http\Controllers\VoterController::class, 'login'])->name('login.attempt');
    Route::post('logout', [App\Http\Controllers\VoterController::class, 'logout'])->name('logout');

    Route::middleware(App\Http\Middleware\VoterAuth::class)->group(function () {
        Route::get('ballot', [App\Http\Controllers\VoterController::class, 'ballot'])->name('ballot');
        Route::post('ballot', [App\Http\Controllers\VoterController::class, 'submitBallot'])->name('ballot.submit');
        Route::get('thank-you', [App\Http\Controllers\VoterController::class, 'thankYou'])->name('thankyou');
        Route::get('already-voted', [App\Http\Controllers\VoterController::class, 'alreadyVoted'])->name('already.voted');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
