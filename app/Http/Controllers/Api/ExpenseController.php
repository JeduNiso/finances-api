<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PayExpenseRequest;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Account;
use App\Models\Expense;
use App\Models\ExpenseLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    private function familyAccountIds(Request $request): array
    {
        return Account::where('family_id', $request->user()->families()->firstOrFail()->id)
            ->pluck('id')
            ->toArray();
    }

    /** GET /api/expenses */
    public function index(Request $request): JsonResponse
    {
        $accountIds = $this->familyAccountIds($request);

        $expenses = Expense::with(['category', 'account'])
            ->whereIn('account_id', $accountIds)
            ->when($request->boolean('active'), fn($q) => $q->where('active', true))
            ->get();

        return response()->json(ExpenseResource::collection($expenses));
    }

    /** POST /api/expenses */
    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $accountIds = $this->familyAccountIds($request);
        abort_unless(in_array($request->account_id, $accountIds), 403);

        $expense = Expense::create($request->validated());

        return response()->json(ExpenseResource::make($expense->load('category', 'account')), 201);
    }

    /** PUT /api/expenses/{expense} */
    public function update(UpdateExpenseRequest $request, Expense $expense): JsonResponse
    {
        abort_unless(in_array($expense->account_id, $this->familyAccountIds($request)), 403);

        $expense->update($request->validated());

        return response()->json(ExpenseResource::make($expense->load('category', 'account')));
    }

    /** DELETE /api/expenses/{expense} */
    public function destroy(Request $request, Expense $expense): JsonResponse
    {
        abort_unless(in_array($expense->account_id, $this->familyAccountIds($request)), 403);

        $expense->delete();

        return response()->json(['message' => 'Gasto fijo eliminado.']);
    }

    /** POST /api/expenses/{expense}/pay */
    public function pay(PayExpenseRequest $request, Expense $expense): JsonResponse
    {
        abort_unless(in_array($expense->account_id, $this->familyAccountIds($request)), 403);

        $log = DB::transaction(function () use ($request, $expense) {
            $log = ExpenseLog::create([
                'expense_id'  => $expense->id,
                'amount_paid' => $request->amount_paid,
                'paid_at'     => $request->paid_at,
                'account_id'  => $request->account_id,
                'notes'       => $request->notes,
            ]);
            Account::where('id', $request->account_id)->decrement('balance', $request->amount_paid);
            return $log;
        });

        return response()->json($log, 201);
    }

    /** GET /api/expenses/calendar — estado pagado/pendiente del mes */
    public function calendar(Request $request): JsonResponse
    {
        $accountIds = $this->familyAccountIds($request);
        $now        = now();

        $expenses = Expense::with(['category', 'account'])
            ->whereIn('account_id', $accountIds)
            ->where('active', true)
            ->get()
            ->map(function (Expense $e) use ($now) {
                $paid = $e->logs()
                    ->whereYear('paid_at', $now->year)
                    ->whereMonth('paid_at', $now->month)
                    ->exists();

                return [
                    'id'           => $e->id,
                    'name'         => $e->name,
                    'amount'       => $e->amount,
                    'day_of_month' => $e->day_of_month,
                    'frequency'    => $e->frequency,
                    'paid'         => $paid,
                    'category'     => ['id' => $e->category?->id, 'name' => $e->category?->name, 'color' => $e->category?->color],
                ];
            });

        return response()->json($expenses);
    }
}
