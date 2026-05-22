<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSpendingRequest;
use App\Http\Requests\UpdateSpendingRequest;
use App\Http\Resources\SpendingResource;
use App\Models\Account;
use App\Models\Spending;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SpendingController extends Controller
{
    private function familyAccountIds(Request $request): array
    {
        return Account::where('family_id', $request->user()->families()->firstOrFail()->id)
            ->pluck('id')
            ->toArray();
    }

    /** GET /api/spending */
    public function index(Request $request): JsonResponse
    {
        $accountIds = $this->familyAccountIds($request);

        $query = Spending::with(['account', 'category', 'user'])
            ->whereIn('account_id', $accountIds);

        if ($request->filled('month'))       { $query->whereMonth('spent_at', $request->month); }
        if ($request->filled('year'))        { $query->whereYear('spent_at', $request->year); }
        if ($request->filled('category_id')) { $query->where('category_id', $request->category_id); }
        if ($request->filled('account_id'))  { $query->where('account_id', $request->account_id); }
        if ($request->filled('user_id'))     { $query->where('user_id', $request->user_id); }

        return response()->json(SpendingResource::collection($query->orderByDesc('spent_at')->get()));
    }

    /** POST /api/spending */
    public function store(StoreSpendingRequest $request): JsonResponse
    {
        $accountIds = $this->familyAccountIds($request);
        abort_unless(in_array($request->account_id, $accountIds), 403);

        $spending = DB::transaction(function () use ($request) {
            $s = Spending::create([
                ...$request->validated(),
                'user_id' => $request->user()->id,
            ]);
            Account::where('id', $s->account_id)->decrement('balance', $s->amount);
            return $s;
        });

        return response()->json(SpendingResource::make($spending->load('account', 'category', 'user')), 201);
    }

    /** PUT /api/spending/{spending} */
    public function update(UpdateSpendingRequest $request, Spending $spending): JsonResponse
    {
        $this->authorizeAccount($request, $spending->account_id);

        DB::transaction(function () use ($request, $spending) {
            // Revertir descuento anterior y aplicar el nuevo
            Account::where('id', $spending->account_id)->increment('balance', $spending->amount);
            $spending->update($request->validated());
            Account::where('id', $spending->account_id)->decrement('balance', $spending->amount);
        });

        return response()->json(SpendingResource::make($spending->load('account', 'category', 'user')));
    }

    /** DELETE /api/spending/{spending} */
    public function destroy(Request $request, Spending $spending): JsonResponse
    {
        $this->authorizeAccount($request, $spending->account_id);

        DB::transaction(function () use ($spending) {
            Account::where('id', $spending->account_id)->increment('balance', $spending->amount);
            $spending->delete();
        });

        return response()->json(['message' => 'Gasto eliminado.']);
    }

    /** GET /api/spending/summary */
    public function summary(Request $request): JsonResponse
    {
        $accountIds = $this->familyAccountIds($request);
        $now        = now();

        $totals = Spending::whereIn('account_id', $accountIds)
            ->whereYear('spent_at', $now->year)
            ->whereMonth('spent_at', $now->month)
            ->join('categories', 'spending.category_id', '=', 'categories.id')
            ->selectRaw('categories.id, categories.name, categories.color, SUM(spending.amount) as total')
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->get();

        return response()->json($totals);
    }

    private function authorizeAccount(Request $request, int $accountId): void
    {
        $ids = $this->familyAccountIds($request);
        abort_unless(in_array($accountId, $ids), 403);
    }
}
