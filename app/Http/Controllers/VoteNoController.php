<?php

namespace App\Http\Controllers;

use App\Models\Suggestion;
use App\Models\VoteNo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteNoController extends Controller
{
    public function vote_no(Request $request, Suggestion $suggestion)
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

        $vote = new VoteNo();
        $vote->user_id = Auth::id();
        $vote->suggestion_id = $suggestion->id;
        $vote->save();

        return back();
    }
}
