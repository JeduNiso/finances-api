<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDebtRequest;
use App\Http\Requests\StoreDebtPaymentRequest;
use App\Http\Requests\UpdateDebtRequest;
use App\Http\Resources\DebtResource;
use App\Models\Account;
use App\Models\Debt;
use App\Models\DebtPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DebtController extends Controller
{
    private function familyId(Request $request): int
    {
        return $request->user()->families()->firstOrFail()->id;
    }

    private function familyAccountIds(Request $request): array
    {
        return Account::where('family_id', $this->familyId($request))->pluck('id')->toArray();
    }

    /** GET /api/debts */
    public function index(Request $request): JsonResponse
    {
        $query = Debt::with(['user', 'account'])
            ->where('user_id', $request->user()->id);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(DebtResource::collection($query->get()));
    }

    /** POST /api/debts */
    public function store(StoreDebtRequest $request): JsonResponse
    {
        $debt = Debt::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json(DebtResource::make($debt->load('account')), 201);
    }

    /** PUT /api/debts/{debt} */
    public function update(UpdateDebtRequest $request, Debt $debt): JsonResponse
    {
        abort_unless($debt->user_id === $request->user()->id, 403);
        $debt->update($request->validated());

        return response()->json(DebtResource::make($debt->load('account')));
    }

    /** DELETE /api/debts/{debt} */
    public function destroy(Request $request, Debt $debt): JsonResponse
    {
        abort_unless($debt->user_id === $request->user()->id, 403);
        $debt->delete();

        return response()->json(['message' => 'Deuda eliminada.']);
    }

    /** POST /api/debts/{debt}/payment */
    public function payment(StoreDebtPaymentRequest $request, Debt $debt): JsonResponse
    {
        abort_unless($debt->user_id === $request->user()->id, 403);
        abort_unless(in_array($request->account_id, $this->familyAccountIds($request)), 403);

        $payment = DB::transaction(function () use ($request, $debt) {
            $payment = DebtPayment::create([
                'debt_id'    => $debt->id,
                'amount'     => $request->amount,
                'paid_at'    => $request->paid_at,
                'account_id' => $request->account_id,
                'notes'      => $request->notes,
            ]);

            $newBalance = max(0, (float) $debt->current_balance - (float) $request->amount);
            $debt->update([
                'current_balance' => $newBalance,
                'status'          => $newBalance <= 0 ? 'paid' : $debt->status,
            ]);

            Account::where('id', $request->account_id)->decrement('balance', $request->amount);

            return $payment;
        });

        return response()->json(DebtResource::make($debt->fresh()->load('payments', 'account')), 201);
    }

    /** GET /api/debts/summary */
    public function summary(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $now    = now();

        $totalOwed = (float) Debt::where('user_id', $userId)
            ->where('status', 'active')
            ->sum('current_balance');

        $paidThisMonth = (float) DebtPayment::whereHas('debt', fn($q) => $q->where('user_id', $userId))
            ->whereYear('paid_at', $now->year)
            ->whereMonth('paid_at', $now->month)
            ->sum('amount');

        $projection = (float) Debt::where('user_id', $userId)
            ->where('status', 'active')
            ->sum('monthly_payment');

        return response()->json([
            'total_owed'      => $totalOwed,
            'paid_this_month' => $paidThisMonth,
            'monthly_projection' => $projection,
        ]);
    }
}
