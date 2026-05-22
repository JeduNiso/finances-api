<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseLog extends Model
{
    protected $table = 'expenses_log';

    protected $fillable = ['expense_id', 'amount_paid', 'paid_at', 'account_id', 'notes'];

    protected $casts = ['amount_paid' => 'decimal:2', 'paid_at' => 'date'];

    public $timestamps = false;

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
