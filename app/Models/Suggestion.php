<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Suggestion extends Model
{
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votesFor(): HasMany
    {
        return $this->hasMany(VoteFor::class);
    }

    public function votesNo(): HasMany
    {
        return $this->hasMany(VoteNo::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
