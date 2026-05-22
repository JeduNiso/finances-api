<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Debt;
use App\Models\Expense;
use App\Models\Spending;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user       = $request->user();
        $family     = $user->families()->firstOrFail();
        $accountIds = Account::where('family_id', $family->id)->pluck('id');
        $now        = now();

        // Balance total
        $totalBalance = (float) Account::whereIn('id', $accountIds)->sum('balance');

        // Gastos del mes por categoría
        $spendingByCategory = Spending::whereIn('account_id', $accountIds)
            ->whereYear('spent_at', $now->year)
            ->whereMonth('spent_at', $now->month)
            ->join('categories', 'spending.category_id', '=', 'categories.id')
            ->selectRaw('categories.id, categories.name, categories.color, SUM(spending.amount) as total')
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->get();

        // Gastos fijos pagados vs pendientes
        $activeExpenses = Expense::whereIn('account_id', $accountIds)->where('active', true)->get();
        $paidExpenses   = 0;
        $pendingExpenses = 0;

        foreach ($activeExpenses as $expense) {
            $paid = $expense->logs()
                ->whereYear('paid_at', $now->year)
                ->whereMonth('paid_at', $now->month)
                ->exists();
            $paid ? $paidExpenses++ : $pendingExpenses++;
        }

        // Deudas activas
        $activeDebts = Debt::with('account')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->get();

        // Top 5 gastos del mes
        $top5 = Spending::with('category')
            ->whereIn('account_id', $accountIds)
            ->whereYear('spent_at', $now->year)
            ->whereMonth('spent_at', $now->month)
            ->orderByDesc('amount')
            ->limit(5)
            ->get();

        // Gastos por miembro
        $spendingByMember = Spending::whereIn('account_id', $accountIds)
            ->whereYear('spent_at', $now->year)
            ->whereMonth('spent_at', $now->month)
            ->join('users', 'spending.user_id', '=', 'users.id')
            ->selectRaw('users.id, users.name, SUM(spending.amount) as total')
            ->groupBy('users.id', 'users.name')
            ->get();

        return response()->json([
            'total_balance'       => $totalBalance,
            'spending_by_category'=> $spendingByCategory,
            'expenses'            => ['paid' => $paidExpenses, 'pending' => $pendingExpenses],
            'active_debts'        => $activeDebts->map(fn($d) => [
                'id'                  => $d->id,
                'creditor'            => $d->creditor,
                'current_balance'     => $d->current_balance,
                'progress_percentage' => $d->progress_percentage,
                'due_date'            => $d->due_date?->toDateString(),
            ]),
            'top5_spending'       => $top5,
            'spending_by_member'  => $spendingByMember,
        ]);
    }
}
