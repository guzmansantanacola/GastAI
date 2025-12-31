<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $categories = [
            // ===== CATEGORÍAS DE GASTOS =====

            // Esenciales
            ['name' => 'Alimentación', 'type' => 'expense', 'icon' => '🍔', 'color' => '#ef4444'],
            ['name' => 'Supermercado', 'type' => 'expense', 'icon' => '🛒', 'color' => '#f97316'],
            ['name' => 'Transporte', 'type' => 'expense', 'icon' => '🚗', 'color' => '#3b82f6'],
            ['name' => 'Combustible', 'type' => 'expense', 'icon' => '⛽', 'color' => '#0ea5e9'],
            ['name' => 'Hogar', 'type' => 'expense', 'icon' => '🏠', 'color' => '#06b6d4'],
            ['name' => 'Alquiler', 'type' => 'expense', 'icon' => '🔑', 'color' => '#0891b2'],

            // Servicios y Suscripciones
            ['name' => 'Suscripciones', 'type' => 'expense', 'icon' => '📱', 'color' => '#a855f7'],
            ['name' => 'Internet/Cable', 'type' => 'expense', 'icon' => '📡', 'color' => '#8b5cf6'],
            ['name' => 'Streaming', 'type' => 'expense', 'icon' => '🎬', 'color' => '#d946ef'],
            ['name' => 'Telefonía', 'type' => 'expense', 'icon' => '📞', 'color' => '#7c3aed'],
            ['name' => 'Servicios', 'type' => 'expense', 'icon' => '⚡', 'color' => '#eab308'],

            // Salud y Bienestar
            ['name' => 'Salud', 'type' => 'expense', 'icon' => '💊', 'color' => '#10b981'],
            ['name' => 'Gimnasio', 'type' => 'expense', 'icon' => '💪', 'color' => '#059669'],
            ['name' => 'Seguro Médico', 'type' => 'expense', 'icon' => '🏥', 'color' => '#14b8a6'],

            // Personal
            ['name' => 'Ropa', 'type' => 'expense', 'icon' => '👕', 'color' => '#ec4899'],
            ['name' => 'Belleza/Cuidado', 'type' => 'expense', 'icon' => '💅', 'color' => '#f43f5e'],
            ['name' => 'Regalos', 'type' => 'expense', 'icon' => '🎁', 'color' => '#fb7185'],

            // Entretenimiento
            ['name' => 'Entretenimiento', 'type' => 'expense', 'icon' => '🎮', 'color' => '#8b5cf6'],
            ['name' => 'Restaurantes', 'type' => 'expense', 'icon' => '🍽️', 'color' => '#f59e0b'],
            ['name' => 'Café/Snacks', 'type' => 'expense', 'icon' => '☕', 'color' => '#d97706'],
            ['name' => 'Viajes', 'type' => 'expense', 'icon' => '✈️', 'color' => '#06b6d4'],
            ['name' => 'Eventos', 'type' => 'expense', 'icon' => '🎉', 'color' => '#ec4899'],

            // Educación y Desarrollo
            ['name' => 'Educación', 'type' => 'expense', 'icon' => '📚', 'color' => '#f59e0b'],
            ['name' => 'Cursos Online', 'type' => 'expense', 'icon' => '🎓', 'color' => '#facc15'],
            ['name' => 'Libros', 'type' => 'expense', 'icon' => '📖', 'color' => '#fbbf24'],

            // Mascotas
            ['name' => 'Mascotas', 'type' => 'expense', 'icon' => '🐶', 'color' => '#84cc16'],
            ['name' => 'Veterinario', 'type' => 'expense', 'icon' => '🏥', 'color' => '#65a30d'],

            // Tecnología
            ['name' => 'Tecnología', 'type' => 'expense', 'icon' => '💻', 'color' => '#6366f1'],
            ['name' => 'Software', 'type' => 'expense', 'icon' => '⚙️', 'color' => '#4f46e5'],

            // Deudas y Financiero
            ['name' => 'Préstamos', 'type' => 'expense', 'icon' => '🏦', 'color' => '#94a3b8'],
            ['name' => 'Tarjetas de Crédito', 'type' => 'expense', 'icon' => '💳', 'color' => '#64748b'],
            ['name' => 'Seguros', 'type' => 'expense', 'icon' => '🛡️', 'color' => '#475569'],
            ['name' => 'Impuestos', 'type' => 'expense', 'icon' => '📋', 'color' => '#78716c'],

            // Varios
            ['name' => 'Mantenimiento', 'type' => 'expense', 'icon' => '🔧', 'color' => '#71717a'],
            ['name' => 'Donaciones', 'type' => 'expense', 'icon' => '❤️', 'color' => '#e11d48'],
            ['name' => 'Otros Gastos', 'type' => 'expense', 'icon' => '💸', 'color' => '#6366f1'],

            // ===== CATEGORÍAS DE INGRESOS =====
            ['name' => 'Salario', 'type' => 'income', 'icon' => '💰', 'color' => '#22c55e'],
            ['name' => 'Freelance', 'type' => 'income', 'icon' => '💻', 'color' => '#14b8a6'],
            ['name' => 'Negocio Propio', 'type' => 'income', 'icon' => '🏢', 'color' => '#10b981'],
            ['name' => 'Inversiones', 'type' => 'income', 'icon' => '📈', 'color' => '#84cc16'],
            ['name' => 'Ventas', 'type' => 'income', 'icon' => '🛍️', 'color' => '#16a34a'],
            ['name' => 'Bonos', 'type' => 'income', 'icon' => '🎯', 'color' => '#059669'],
            ['name' => 'Regalos/Propinas', 'type' => 'income', 'icon' => '🎁', 'color' => '#65a30d'],
            ['name' => 'Reembolsos', 'type' => 'income', 'icon' => '↩️', 'color' => '#4ade80'],
            ['name' => 'Otros Ingresos', 'type' => 'income', 'icon' => '💵', 'color' => '#10b981'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
