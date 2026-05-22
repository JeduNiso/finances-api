<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFamilyRequest;
use App\Http\Resources\FamilyResource;
use App\Http\Resources\UserResource;
use App\Models\Family;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FamilyController extends Controller
{
    /** POST /api/families — crear familia y asignar owner */
    public function store(StoreFamilyRequest $request): JsonResponse
    {
        $user = $request->user();

        $family = Family::create([
            'name'     => $request->name,
            'owner_id' => $user->id,
        ]);

        $family->members()->attach($user->id, ['role' => 'owner']);

        return response()->json(FamilyResource::make($family->load('owner', 'members', 'accounts')), 201);
    }

    /** GET /api/families/mine — familia del usuario autenticado */
    public function mine(Request $request): JsonResponse
    {
        $family = $request->user()
            ->families()
            ->with(['owner', 'members', 'accounts.bank'])
            ->first();

        if (! $family) {
            return response()->json(['message' => 'No perteneces a ninguna familia.'], 404);
        }

        return response()->json(FamilyResource::make($family));
    }

    /** POST /api/families/invite — invitar usuario por email */
    public function invite(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $family = $this->resolveFamily($request);

        $this->authorizeOwnerOrAdmin($request->user(), $family);

        $invitee = User::where('email', $request->email)->firstOrFail();

        if ($family->members()->where('user_id', $invitee->id)->exists()) {
            return response()->json(['message' => 'El usuario ya es miembro de esta familia.'], 422);
        }

        $family->members()->attach($invitee->id, ['role' => 'member']);

        return response()->json(['message' => 'Usuario invitado correctamente.']);
    }

    /** DELETE /api/families/members/{user} — remover miembro */
    public function removeMember(Request $request, User $user): JsonResponse
    {
        $family = $this->resolveFamily($request);

        $this->authorizeOwnerOrAdmin($request->user(), $family);

        if ($family->owner_id === $user->id) {
            return response()->json(['message' => 'No puedes remover al owner de la familia.'], 422);
        }

        $family->members()->detach($user->id);

        return response()->json(['message' => 'Miembro removido correctamente.']);
    }

    /** GET /api/families/members — listar miembros con rol */
    public function members(Request $request): JsonResponse
    {
        $family = $this->resolveFamily($request);

        $members = $family->members()->withPivot('role', 'joined_at')->get()
            ->map(fn($m) => [
                'id'        => $m->id,
                'name'      => $m->name,
                'username'  => $m->username,
                'email'     => $m->email,
                'role'      => $m->pivot->role,
                'joined_at' => $m->pivot->joined_at,
            ]);

        return response()->json($members);
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private function resolveFamily(Request $request): Family
    {
        return $request->user()->families()->firstOrFail();
    }

    private function authorizeOwnerOrAdmin(User $user, Family $family): void
    {
        $pivot = $family->members()->where('user_id', $user->id)->first()?->pivot;

        abort_unless($pivot && in_array($pivot->role, ['owner', 'admin']), 403, 'Sin permisos suficientes.');
    }
}
