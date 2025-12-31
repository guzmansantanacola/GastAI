<?php
// En DashboardController.php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class StatsController extends Controller
{

    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Total de gastos (cantidad de transacciones tipo expense)
        $totalExpenses = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->count();

        // Total de ingresos (cantidad de transacciones tipo income)
        $totalIncome = Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->count();

        // Gastos por categoría (últimos 6 meses)
        $sixMonthsAgo = now()->subMonths(6);
        $expensesByCategory = Transaction::where('user_id', $userId)
            ->where('transactions.type', 'expense')
            ->where('transactions.date', '>=', $sixMonthsAgo)
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category, categories.color as color, SUM(transactions.amount) as total')
            ->groupBy('categories.name', 'categories.color')
            ->orderByDesc('total')
            ->get();

        // Comparativa mensual de gastos e ingresos (últimos 6 meses)
        $monthlyExpenses = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->where('date', '>=', $sixMonthsAgo)
            ->selectRaw('YEAR(date) as year, MONTH(date) as month, SUM(amount) as total')
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
        $monthlyChange = 0;

if ($monthlyExpenses->count() === 2 && $monthlyExpenses[1]->total > 0) {
    $current = $monthlyExpenses[0]->total;
    $previous = $monthlyExpenses[1]->total;
    $monthlyChange = round((($current - $previous) / $previous) * 100);
}
        $monthlyIncome = Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->where('date', '>=', $sixMonthsAgo)
            ->selectRaw('YEAR(date) as year, MONTH(date) as month, SUM(amount) as total')
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
        $averageMonthly = Transaction::where('user_id', $userId)
    ->where('type', 'expense')
    ->selectRaw('YEAR(date) as year, MONTH(date) as month, SUM(amount) as total')
    ->groupBy('year', 'month')
    ->get()
    ->avg('total');
    $highestExpense = Transaction::where('user_id', $userId)
    ->where('transactions.type', 'expense')
    ->join('categories', 'transactions.category_id', '=', 'categories.id')
    ->select('transactions.amount', 'categories.name as category')
    ->orderByDesc('transactions.amount')
    ->first();
    $dominantCategory = Transaction::where('user_id', $userId)
    ->where('transactions.type', 'expense')
    ->join('categories', 'transactions.category_id', '=', 'categories.id')
    ->selectRaw('categories.name, SUM(transactions.amount) as total')
    ->groupBy('categories.name')
    ->orderByDesc('total')
    ->first();

$totalExpensesAmount = Transaction::where('user_id', $userId)
    ->where('transactions.type', 'expense')
    ->sum('amount');

$dominantPercentage = $totalExpensesAmount > 0
    ? round(($dominantCategory->total / $totalExpensesAmount) * 100)
    : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_expenses' => $totalExpenses,
                'total_income' => $totalIncome,
                'monthly_expenses' => $monthlyExpenses,
                'monthly_income' => $monthlyIncome,
                'expenses_by_category' => $expensesByCategory,
                'average_monthly_expense' => $averageMonthly,
                'highest_expense' => $highestExpense,
                  'dominant_category' => [
            'name' => $dominantCategory->name ?? null,
            'percentage' => $dominantPercentage
        ],
        'monthly_change' => $monthlyChange
            ]
        ]);
    }
}
