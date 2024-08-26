<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SuggestionController;
use App\Http\Controllers\VoteForController;
use App\Http\Controllers\VoteNoController;
use App\Models\Suggestion;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


# all routes

Route::get('/dashboard/suggestions', [SuggestionController::class, 'index'])
    ->name('suggestions')
    ->middleware(['auth', 'verified']);


Route::get('/dashboard/suggestions/create', [SuggestionController::class, 'create'])
    ->name('suggestions.create')
    ->middleware(['auth', 'verified']);

Route::post('/dashboard/suggestions/store', [SuggestionController::class, 'store'])
    ->name('suggestions.store')
    ->middleware(['auth', 'verified']);

Route::get('/suggestions/{suggestion}', [SuggestionController::class, 'show'])
    ->name('suggestions.index')
    ->middleware(['auth', 'verified']);

Route::post('/reviews/create/{suggestion}', [ReviewController::class, 'store'])
    ->name('review.store')
    ->middleware(['auth', 'verified']);

Route::get('/dashboard/suggestions/edit/{suggestion}', [SuggestionController::class, 'edit'])
    ->name('suggestions.edit')
    ->middleware(['auth', 'verified']);

Route::post('/dashboard/suggestions/update/{suggestion}', [SuggestionController::class, 'update'])
    ->name('suggestions.update')
    ->middleware(['auth', 'verified']);

Route::get('/dashboard/suggestions/delete/{suggestion}', [SuggestionController::class, 'delete'])
    ->name('suggestions.delete')
    ->middleware(['auth', 'verified']);

Route::get('/suggestions/vote/no/{suggestion}', [VoteNoController::class, 'vote_no'])
    ->name('suggestions.vote.no')
    ->middleware(['auth', 'verified']);

Route::get('/suggestions/vote/yes/{suggestion}', [VoteForController::class, 'vote_yes'])
    ->name('suggestions.vote.yes')
    ->middleware(['auth', 'verified']);

Route::get('/api/suggestions', function () {
    $suggestions = Suggestion::orderBy('created_at', 'desc')->get();
    foreach ($suggestions as $suggestion) {
        $suggestion->vote_for_count = $suggestion->votesFor->count();
        $suggestion->vote_no_count = $suggestion->votesNo->count();
        $suggestion->user;
    }
    return response()->json($suggestions->toArray());
});


# auto generate

Route::get('/', function () {
    $suggestions = Suggestion::orderBy('created_at', 'desc')->get();
    foreach ($suggestions as $suggestion) {
        $suggestion->vote_for_count = $suggestion->votesFor->count();
        $suggestion->vote_no_count = $suggestion->votesNo->count();
        $suggestion->user;
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'suggestions' => $suggestions,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
