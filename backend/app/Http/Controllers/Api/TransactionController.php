<?php

namespace App\Http\Controllers\Api;
use App\Models\Transaction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $transactions = Transaction::with('category')
            ->where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
{
    // 1. VALIDAR los datos
    $validated = $request->validate([
        'type' => 'required|in:income,expense',
        'amount' => 'required|numeric|min:0',
        'description' => 'nullable|string|max:255',
        'date' => 'required|date',
        'category_id' => 'required|exists:categories,id',
        'is_monthly' => 'boolean'
    ]);

    // 2. Agregar el user_id del usuario autenticado
    $validated['user_id'] = $request->user()->id;

    // 3. Asegurar que is_monthly tenga un valor por defecto
    $validated['is_monthly'] = $validated['is_monthly'] ?? false;

    // 4. Crear la transacción
    $transaction = Transaction::create($validated);

    // 5. Devolverla con su categoría
    return response()->json([
        'success' => true,
        'data' => $transaction->load('category')
    ], 201);
}
    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $transaction = Transaction::with('category')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'is_monthly' => 'boolean'
        ]);

        $transaction->update($validated);

        return response()->json([
            'success' => true,
            'data' => $transaction->load('category')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $transaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transacción eliminada correctamente'
        ]);
    }
}
