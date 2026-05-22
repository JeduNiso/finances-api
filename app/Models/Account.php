<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    protected $fillable = ['account_number', 'balance', 'bank_id', 'family_id'];

    protected $casts = ['balance' => 'decimal:2'];

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }

    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'users_accounts')
                    ->withPivot('created_at');
    }

    public function spending(): HasMany
    {
        return $this->hasMany(Spending::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function expenseLogs(): HasMany
    {
        return $this->hasMany(ExpenseLog::class);
    }

    public function debts(): HasMany
    {
        return $this->hasMany(Debt::class);
    }

    public function debtPayments(): HasMany
    {
        return $this->hasMany(DebtPayment::class);
    }
}
