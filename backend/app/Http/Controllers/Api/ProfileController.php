<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    /**
     * Obtener perfil del usuario autenticado
     */
    public function show(Request $request)
    {
        $user = $request->user();

        // Total de transacciones registradas
        $totalTransactions = Transaction::where('user_id', $user->id)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'total_transactions' => $totalTransactions,
            ]
        ]);
    }

    /**
     * Actualizar perfil del usuario
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8',
            'new_password_confirmation' => 'nullable|string|same:new_password'
        ]);

        // Actualizar nombre y email
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // Si está cambiando la contraseña
        if (!empty($validated['new_password'])) {
            // Verificar contraseña actual
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'La contraseña actual es incorrecta'
                ], 422);
            }

            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ],
            'message' => 'Perfil actualizado correctamente'
        ]);
    }
}
