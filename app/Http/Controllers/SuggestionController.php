<?php

namespace App\Http\Controllers;

use App\Events\SuggestionCreated;
use App\Models\Suggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SuggestionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $suggestions = $user->suggestions;
        foreach ($suggestions as $suggestion) {
            $suggestion->vote_for_count = $suggestion->votesFor->count();
            $suggestion->vote_no_count = $suggestion->votesNo->count();
            $suggestion->user;
        }
        return Inertia::render('Auth/Suggestions', [
            'suggestions' => $suggestions,
        ]);
    }

    public function create()
    {
        return Inertia::render('Auth/SuggestionsCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        $suggest = new Suggestion();
        $suggest->title = $request->title;
        $suggest->description = $request->content;
        $suggest->user_id = Auth::id();
        $suggest->save();

        broadcast(new SuggestionCreated($suggest))->toOthers();

        return redirect()->route('suggestions.index', $suggest->id);
    }

    public function edit(Suggestion $suggestion, Request $request)
    {
        if (Auth::id() !== $suggestion->user_id) return redirect("/");

        $suggestion->vote_for_count = $suggestion->votesFor->count();
        $suggestion->vote_no_count = $suggestion->votesNo->count();
        return Inertia::render('Auth/SuggestionsEdit', [
            'suggestion' => $suggestion
        ]);
    }

    public function delete(Suggestion $suggestion, Request $request)
    {
        if (Auth::id() !== $suggestion->user_id) return redirect("/");

        foreach ($suggestion->reviews as $review)
        {
            $review->delete();
        }
        $suggestion->delete();
        return redirect("/dashboard/suggestions");
    }

    public function update(Suggestion $suggestion, Request $request)
    {
        if (Auth::id() !== $suggestion->user_id) return redirect("/");
        $request->validate([
            "title" => "required|max:255",
            "content" => "required",
        ]);

        $suggestion->title = $request->title;
        $suggestion->description = $request->content;
        $suggestion->save();

        return redirect()->route('suggestions.index', $suggestion->id);
    }

    public function show(Suggestion $suggestion)
    {
        $hasVoted = false;
        foreach ($suggestion->reviews as $review) {
            $review->user;
        }
        foreach ($suggestion->votesFor as $vote)
        {
            if ($vote->user_id === Auth::id())
                $hasVoted = true;
        }
        foreach ($suggestion->votesNo as $vote)
        {
            if ($vote->user_id === Auth::id())
                $hasVoted = true;
        }
        $suggestion->user;
        $suggestion->vote_for_count = $suggestion->votesFor->count();
        $suggestion->vote_no_count = $suggestion->votesNo->count();
        return Inertia::render('Suggestion', [
            'suggestion' => $suggestion,
            'hasVoted' => $hasVoted
        ]);
    }
}
