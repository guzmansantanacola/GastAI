<?php
// En DashboardController.php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{

public function index(Request $request)
{
    $userId = $request->user()->id;

    // Balance Total (histórico - todos los tiempos)
    $balance = Transaction::where('user_id', $userId)
        ->selectRaw('
            SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) -
            SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as balance
        ')
        ->first()
        ->balance ?? 0;

    // Total de gastos del mes actual
    $totalExpenses = Transaction::where('user_id', $userId)
        ->where('type', 'expense')
        ->whereMonth('date', now()->month)
        ->whereYear('date', now()->year)
        ->sum('amount');

    // Total de ingresos del mes actual
    $totalIncome = Transaction::where('user_id', $userId)
        ->where('type', 'income')
        ->whereMonth('date', now()->month)
        ->whereYear('date', now()->year)
        ->sum('amount');

    // Gastos por categoría
    $expensesByCategory = Transaction::where('user_id', $userId)
        ->where('type', 'expense')
        ->whereMonth('date', now()->month)
        ->with('category')
        ->selectRaw('category_id, SUM(amount) as total')
        ->groupBy('category_id')
        ->get();
    $currentMonth = Transaction::where('user_id', $userId)
    ->where('type', 'expense')
    ->whereMonth('date', now()->month)
    ->sum('amount');

// Mes anterior
$lastMonth = Transaction::where('user_id', $userId)
    ->where('type', 'expense')
    ->whereMonth('date', now()->month-1)
    ->sum('amount');

// Porcentaje de cambio
$percentageChange = $lastMonth > 0
    ? (($currentMonth - $lastMonth) / $lastMonth) * 100
    : 0;
$dailyExpenses = Transaction::where('user_id', $userId)
    ->where('type', 'expense')
    ->whereMonth('date', now()->month)
    ->selectRaw('DATE(date) as day, SUM(amount) as total')
    ->groupBy('day')
    ->orderBy('day')
    ->get();
    return response()->json([
        'success' => true,
        'data' => [
            'monthExpenses' => $totalExpenses,
            'monthIncome' => $totalIncome,
            'balance' => $balance,
            'lastMonth' => $lastMonth,
            'expensesByCategory' => $expensesByCategory,
            'percentageChange' => $percentageChange,
            'dailyExpenses' => $dailyExpenses,
        ]
    ]);
}
}
