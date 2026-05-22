<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('debts', function (Blueprint $table) {
            $table->id();
            $table->string('creditor', 150);
            $table->string('description', 255)->nullable();
            $table->decimal('original_amount', 15, 2);
            $table->decimal('current_balance', 15, 2);
            $table->decimal('monthly_payment', 15, 2)->nullable();
            $table->decimal('interest_rate', 5, 2)->default(0.00);
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->enum('status', ['active', 'paid', 'paused'])->default('active');
            $table->foreignId('account_id')->nullable()->constrained('accounts')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete()->cascadeOnUpdate();
            $table->timestamps();
            $table->index('user_id');
            $table->index('status');
        });

        Schema::create('debts_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('debt_id')->constrained('debts')->cascadeOnDelete()->cascadeOnUpdate();
            $table->decimal('amount', 15, 2);
            $table->date('paid_at');
            $table->foreignId('account_id')->constrained('accounts')->restrictOnDelete()->cascadeOnUpdate();
            $table->string('notes', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index('debt_id');
            $table->index('paid_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('debts_payments');
        Schema::dropIfExists('debts');
    }
};
