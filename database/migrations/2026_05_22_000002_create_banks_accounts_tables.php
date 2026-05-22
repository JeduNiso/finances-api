<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banks', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->timestamps();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('account_number', 50)->unique();
            $table->decimal('balance', 15, 2)->default(0.00);
            $table->foreignId('bank_id')->constrained('banks')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('family_id')->constrained('families')->restrictOnDelete()->cascadeOnUpdate();
            $table->timestamps();
            $table->index('bank_id');
            $table->index('family_id');
        });

        Schema::create('users_accounts', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamp('created_at')->useCurrent();
            $table->primary(['user_id', 'account_id']);
            $table->index('account_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users_accounts');
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('banks');
    }
};
