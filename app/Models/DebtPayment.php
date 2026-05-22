<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DebtPayment extends Model
{
    protected $table = 'debts_payments';

    protected $fillable = ['debt_id', 'amount', 'paid_at', 'account_id', 'notes'];

    protected $casts = ['amount' => 'decimal:2', 'paid_at' => 'date'];

    public $timestamps = false;

    public function debt(): BelongsTo
    {
        return $this->belongsTo(Debt::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
