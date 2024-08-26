<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Suggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, Suggestion $suggestion) {
        $request->validate([
            'content' => 'required'
        ]);

        $reviews = new Review();
        $reviews->user_id = Auth::id();
        $reviews->suggestion_id = $suggestion->id;
        $reviews->content = $request->content;
        $reviews->save();

        return back();
    }
}
