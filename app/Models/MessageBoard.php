<?php

namespace App\Models;

use App\Http\Controllers\MessageBoardController;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use ParagonIE\CipherSweet\EncryptedRow;
use Spatie\LaravelCipherSweet\Concerns\UsesCipherSweet;
use Spatie\LaravelCipherSweet\Contracts\CipherSweetEncrypted;

class MessageBoard extends Base implements CipherSweetEncrypted
{
    use HasFactory, UsesCipherSweet;

    public static string $controller = MessageBoardController::class;

    protected $fillable
        = [
            'user_id',
            'title',
            'uuid',
            'last_sender',
            'last_message',
        ];

    public function scopeMine(Builder $q)
    {
        $q->where('user_id', Auth::id());
    }

    public $timestamps = ['last_activity'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function participants()
    {
        return $this->hasMany(MessagesBoardsParticipant::class);
    }

    public function getParticipants()
    {
        return $this->hasManyThrough(User::class, Message::class, 'board_id', 'id', null, 'user_id');
    }

    public function sender()
    {
        return $this->hasOne(User::class, 'id', 'last_sender');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'board_id');
    }

    public static function configureCipherSweet(EncryptedRow $encryptedRow): void
    {
        $encryptedRow->addOptionalTextField('last_message');
    }
}
