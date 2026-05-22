<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Debt extends Model
{
    protected $fillable = [
        'creditor', 'description', 'original_amount', 'current_balance',
        'monthly_payment', 'interest_rate', 'start_date', 'due_date',
        'status', 'account_id', 'user_id',
    ];

    protected $casts = [
        'original_amount'  => 'decimal:2',
        'current_balance'  => 'decimal:2',
        'monthly_payment'  => 'decimal:2',
        'interest_rate'    => 'decimal:2',
        'start_date'       => 'date',
        'due_date'         => 'date',
    ];

    protected $appends = ['progress_percentage'];

    public function getProgressPercentageAttribute(): float
    {
        if ((float) $this->original_amount === 0.0) {
            return 100.0;
        }
        $paid = (float) $this->original_amount - (float) $this->current_balance;
        return round(($paid / (float) $this->original_amount) * 100, 2);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(DebtPayment::class);
    }
}
