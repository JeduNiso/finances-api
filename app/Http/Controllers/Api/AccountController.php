<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{
    private function familyId(Request $request): int
    {
        return $request->user()->families()->firstOrFail()->id;
    }

    public function index(Request $request): JsonResponse
    {
        $accounts = Account::with('bank')
            ->where('family_id', $this->familyId($request))
            ->get();

        return response()->json(AccountResource::collection($accounts));
    }

    public function store(StoreAccountRequest $request): JsonResponse
    {
        $account = Account::create([
            ...$request->validated(),
            'family_id' => $this->familyId($request),
        ]);

        $account->users()->attach($request->user()->id);

        return response()->json(AccountResource::make($account->load('bank')), 201);
    }

    public function update(UpdateAccountRequest $request, Account $account): JsonResponse
    {
        $this->authorizeFamily($request, $account);
        $account->update($request->validated());

        return response()->json(AccountResource::make($account->load('bank')));
    }

    public function destroy(Request $request, Account $account): JsonResponse
    {
        $this->authorizeFamily($request, $account);
        $account->delete();

        return response()->json(['message' => 'Cuenta eliminada.']);
    }

    /** GET /api/accounts/{id}/summary */
    public function summary(Request $request, Account $account): JsonResponse
    {
        $this->authorizeFamily($request, $account);

        $now       = now();
        $monthSpent = (float) $account->spending()
            ->whereYear('spent_at', $now->year)
            ->whereMonth('spent_at', $now->month)
            ->sum('amount');

        return response()->json([
            'account_id'   => $account->id,
            'balance'      => $account->balance,
            'month_spent'  => $monthSpent,
        ]);
    }

    private function authorizeFamily(Request $request, Account $account): void
    {
        abort_unless($account->family_id === $this->familyId($request), 403);
    }
}
