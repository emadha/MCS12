<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stripe\Coupon;

/**
 *
 * @property null|\App\Models\User $user
 */
class Credit extends Model
{
    use HasFactory;

    /**
     * @var string[]
     */
    protected $fillable
        = [
            'user_id',
            'amount',
            'note',
            'item_id',
            'item_type',
            'used_coupon',
            'approved',
        ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function item(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo()->withTrashed();
    }

    public function coupon()
    {
        return $this->belongsTo(CreditsCoupons::class);
    }
}
