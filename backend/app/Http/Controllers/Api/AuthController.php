<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicantResource;
use App\Models\User;
use App\Models\Applicant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ─── ADMIN AUTH ──────────────────────────────────────

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->where('role', 'admin')->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan tidak sesuai.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function me(Request $request)
    {
        $data = [
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'role' => $request->user()->role,
        ];

        // If applicant, include their applicant data
        if ($request->user()->role === 'applicant' && $request->user()->applicant) {
            $data['applicant'] = new ApplicantResource($request->user()->applicant->load('payments'));
        }

        return response()->json(['user' => $data]);
    }

    // ─── USER AUTH ───────────────────────────────────────

    public function userLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->where('role', 'applicant')->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Revoke old tokens, create new one
        $user->tokens()->delete();
        $token = $user->createToken('applicant-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function userLogout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil.']);
    }

    // ─── ADMIN DASHBOARD ─────────────────────────────────

    public function dashboard()
    {
        $monthStart = now()->startOfMonth();
        $monthEnd = now()->endOfMonth();

        $counts = Applicant::selectRaw("
            COUNT(*) as total_pendaftar,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'review' THEN 1 ELSE 0 END) as review,
            SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as diterima,
            SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
        ")->first();

        $monthCount = Applicant::whereBetween('created_at', [$monthStart, $monthEnd])->count();

        return response()->json(['data' => [
            'total_pendaftar' => (int) $counts->total_pendaftar,
            'pending' => (int) $counts->pending,
            'review' => (int) $counts->review,
            'diterima' => (int) $counts->diterima,
            'ditolak' => (int) $counts->ditolak,
            'pendaftar_bulan_ini' => $monthCount,
        ]]);
    }
}
