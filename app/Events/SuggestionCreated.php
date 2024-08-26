<?php

namespace App\Events;

use App\Models\Suggestion;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SuggestionCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $suggestion;

    public function __construct(Suggestion $suggestion)
    {
        $suggestion->vote_for_count = $suggestion->votesFor->count();
        $suggestion->vote_no_count = $suggestion->votesNo->count();
        $suggestion->user;
        $suggestion->reviews;
        $this->suggestion = $suggestion;
    }



    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastToEveryone(): array
    {
        return [
            new Channel('suggestions')
        ];
    }
}
