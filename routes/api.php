<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\BankController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DebtController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\FamilyController;
use App\Http\Controllers\Api\SpendingController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ── Auth (público) ───────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// ── Rutas protegidas ─────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);

    // Familia
    Route::post('families',                      [FamilyController::class, 'store']);
    Route::get('families/mine',                  [FamilyController::class, 'mine']);
    Route::get('families/members',               [FamilyController::class, 'members']);
    Route::post('families/invite',               [FamilyController::class, 'invite']);
    Route::delete('families/members/{user}',     [FamilyController::class, 'removeMember']);

    // Cuentas
    Route::get('accounts',                       [AccountController::class, 'index']);
    Route::post('accounts',                      [AccountController::class, 'store']);
    Route::put('accounts/{account}',             [AccountController::class, 'update']);
    Route::delete('accounts/{account}',          [AccountController::class, 'destroy']);
    Route::get('accounts/{account}/summary',     [AccountController::class, 'summary']);

    // Gastos puntuales
    Route::get('spending/summary',               [SpendingController::class, 'summary']);
    Route::get('spending',                       [SpendingController::class, 'index']);
    Route::post('spending',                      [SpendingController::class, 'store']);
    Route::put('spending/{spending}',            [SpendingController::class, 'update']);
    Route::delete('spending/{spending}',         [SpendingController::class, 'destroy']);

    // Gastos fijos
    Route::get('expenses/calendar',              [ExpenseController::class, 'calendar']);
    Route::get('expenses',                       [ExpenseController::class, 'index']);
    Route::post('expenses',                      [ExpenseController::class, 'store']);
    Route::put('expenses/{expense}',             [ExpenseController::class, 'update']);
    Route::delete('expenses/{expense}',          [ExpenseController::class, 'destroy']);
    Route::post('expenses/{expense}/pay',        [ExpenseController::class, 'pay']);

    // Deudas
    Route::get('debts/summary',                  [DebtController::class, 'summary']);
    Route::get('debts',                          [DebtController::class, 'index']);
    Route::post('debts',                         [DebtController::class, 'store']);
    Route::put('debts/{debt}',                   [DebtController::class, 'update']);
    Route::delete('debts/{debt}',                [DebtController::class, 'destroy']);
    Route::post('debts/{debt}/payment',          [DebtController::class, 'payment']);

    // Catálogos
    Route::get('banks',                          [BankController::class, 'index']);
    Route::apiResource('categories',             CategoryController::class)->except(['show']);

    // Usuarios (admin)
    Route::apiResource('users', UserController::class);
});


