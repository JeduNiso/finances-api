<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('icon', 50)->nullable();
            $table->string('color', 20)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('spending', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 15, 2);
            $table->string('description', 255)->nullable();
            $table->date('spent_at');
            $table->foreignId('account_id')->constrained('accounts')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete()->cascadeOnUpdate();
            $table->timestamp('created_at')->useCurrent();
            $table->index('account_id');
            $table->index('category_id');
            $table->index('user_id');
            $table->index('spent_at');
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->decimal('amount', 15, 2);
            $table->tinyInteger('day_of_month');
            $table->enum('frequency', ['monthly', 'bimonthly', 'quarterly', 'yearly'])->default('monthly');
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('account_id')->constrained('accounts')->restrictOnDelete()->cascadeOnUpdate();
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->index('account_id');
            $table->index('active');
        });

        Schema::create('expenses_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_id')->constrained('expenses')->cascadeOnDelete()->cascadeOnUpdate();
            $table->decimal('amount_paid', 15, 2);
            $table->date('paid_at');
            $table->foreignId('account_id')->constrained('accounts')->restrictOnDelete()->cascadeOnUpdate();
            $table->string('notes', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index('expense_id');
            $table->index('paid_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses_log');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('spending');
        Schema::dropIfExists('categories');
    }
};
