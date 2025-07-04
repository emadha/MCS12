<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessagesBoardsParticipant extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'message_board_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function board()
    {
        return $this->belongsTo(MessageBoard::class);
    }
}
