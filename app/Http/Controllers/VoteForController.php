<?php

namespace App\Http\Controllers;

use App\Models\Suggestion;
use App\Models\VoteFor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteForController extends Controller
{
    public function vote_yes(Request $request, Suggestion $suggestion)
    {
        $hasVoted = false;
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
        if ($hasVoted) return back();

        $vote = new VoteFor();
        $vote->user_id = Auth::id();
        $vote->suggestion_id = $suggestion->id;
        $vote->save();

        return back();
    }
}
