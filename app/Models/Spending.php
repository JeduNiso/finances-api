<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Spending extends Model
{
    protected $table = 'spending';

    protected $fillable = ['amount', 'description', 'spent_at', 'account_id', 'category_id', 'user_id'];

    protected $casts = ['amount' => 'decimal:2', 'spent_at' => 'date'];

    public $timestamps = false;

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
