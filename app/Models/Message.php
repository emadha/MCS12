<?php

namespace App\Models;

use App\Http\Controllers\MessageController;
use App\Traits\HasFavorites;
use App\Traits\HasInteractions;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use ParagonIE\CipherSweet\EncryptedRow;
use Spatie\LaravelCipherSweet\Concerns\UsesCipherSweet;
use Spatie\LaravelCipherSweet\Contracts\CipherSweetEncrypted;
use stdClass;

/**
 *
 * @property \Illuminate\Database\Eloquent\Relations\BelongsTo $board
 */
class Message extends Base implements CipherSweetEncrypted
{
    use HasFactory, HasInteractions, HasFavorites, UsesCipherSweet;

    public static string $controller = MessageController::class;
    /**
     * @var string[]
     */
    protected $fillable = ['user_id', 'target_id', 'content', 'board_id'];

    /**
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeMine(Builder $query): Builder
    {
        return $query->where(function ($q) {
            $q->where('user_id', Auth::id())->orWhere('target_id', Auth::id());
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function target(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'target_id');
    }


    public function getDisplayAttribute(): stdClass
    {
        $display = parent::getDisplayAttribute();
        $display->title = 'Message sent `'.Str::limit($this->content, 2).'`';

        return $display;
    }

    /**
     * @return mixed
     */
    public function destination()
    {
        return $this->user_id === Auth::id() ? $this->target_id : $this->user_id;
    }

    public static function configureCipherSweet(EncryptedRow $encryptedRow): void
    {
        $encryptedRow->addField('content');
    }

    public function board()
    {
        return $this->belongsTo(MessageBoard::class, 'board_id');
    }
}
