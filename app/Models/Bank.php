<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bank extends Model
{
    protected $fillable = ['name'];

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }
}
