<?php

namespace App\Services;

/**
 * Servicio de IA para análisis de gastos y recomendaciones
 * 
 * IMPORTANTE: Para usar este servicio necesitas:
 * 1. Instalar: composer require openai-php/client
 * 2. Configurar OPENAI_API_KEY en .env
 * 3. O usar Gemini (gratuito) cambiando la implementación
 */
class AIService
{
    private $apiKey;

    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY');
    }

    /**
     * Analiza los gastos del usuario y da recomendaciones
     */
    public function analyzeExpenses($transactions, $userMessage = null)
    {
        // Preparar datos de transacciones
        $expenseData = $this->prepareExpenseData($transactions);
        
        // Crear prompt para la IA
        $prompt = $this->buildAnalysisPrompt($expenseData, $userMessage);
        
        // Llamar a OpenAI (o Gemini)
        $response = $this->callAI($prompt);
        
        return [
            'analysis' => $response,
            'total_expenses' => $expenseData['total_expenses'],
            'total_income' => $expenseData['total_income'],
            'balance' => $expenseData['balance'],
        ];
    }

    /**
     * Responde preguntas específicas del usuario
     */
    public function chat($userMessage, $transactions = [])
    {
        $expenseData = $this->prepareExpenseData($transactions);
        
        $prompt = "Eres un asistente financiero experto. El usuario tiene estos datos:
        
Ingresos totales: \${$expenseData['total_income']}
Gastos totales: \${$expenseData['total_expenses']}
Balance: \${$expenseData['balance']}

Categorías de gastos:
{$this->formatCategories($expenseData['categories'])}

Pregunta del usuario: {$userMessage}

Responde de forma amigable, clara y con consejos prácticos.";

        return $this->callAI($prompt);
    }

    /**
     * Genera sugerencias automáticas basadas en patrones
     */
    public function getSuggestions($transactions)
    {
        $expenseData = $this->prepareExpenseData($transactions);
        
        $prompt = "Basándote en estos datos financieros, dame 3-5 sugerencias concretas para ahorrar dinero:

Ingresos: \${$expenseData['total_income']}
Gastos: \${$expenseData['total_expenses']}
Balance: \${$expenseData['balance']}

Categorías:
{$this->formatCategories($expenseData['categories'])}

Da sugerencias específicas y prácticas. Usa viñetas.";

        return $this->callAI($prompt);
    }

    /**
     * Prepara los datos de transacciones para análisis
     */
    private function prepareExpenseData($transactions)
    {
        $totalIncome = 0;
        $totalExpenses = 0;
        $categories = [];

        foreach ($transactions as $transaction) {
            if ($transaction->type === 'income') {
                $totalIncome += $transaction->amount;
            } else {
                $totalExpenses += $transaction->amount;
                
                $categoryName = $transaction->category->name ?? 'Sin categoría';
                if (!isset($categories[$categoryName])) {
                    $categories[$categoryName] = 0;
                }
                $categories[$categoryName] += $transaction->amount;
            }
        }

        return [
            'total_income' => $totalIncome,
            'total_expenses' => $totalExpenses,
            'balance' => $totalIncome - $totalExpenses,
            'categories' => $categories,
        ];
    }

    /**
     * Construye el prompt para análisis
     */
    private function buildAnalysisPrompt($data, $userMessage = null)
    {
        $prompt = "Eres un asesor financiero experto. Analiza estos datos:

📊 RESUMEN FINANCIERO:
• Ingresos totales: \${$data['total_income']}
• Gastos totales: \${$data['total_expenses']}
• Balance: \${$data['balance']}

💰 GASTOS POR CATEGORÍA:
{$this->formatCategories($data['categories'])}

";

        if ($userMessage) {
            $prompt .= "\nCONSULTA DEL USUARIO: {$userMessage}\n\n";
        }

        $prompt .= "Proporciona:
1. Un análisis breve de la situación financiera
2. 3-5 recomendaciones específicas para ahorrar
3. Aspectos positivos que está haciendo bien
4. Un consejo de motivación

Responde en español, de forma amigable y práctica.";

        return $prompt;
    }

    /**
     * Formatea categorías para el prompt
     */
    private function formatCategories($categories)
    {
        $formatted = "";
        foreach ($categories as $name => $amount) {
            $formatted .= "• {$name}: \${$amount}\n";
        }
        return $formatted ?: "• Sin categorías registradas";
    }

    /**
     * Llama a la API de IA (OpenAI, Gemini, etc.)
     * 
     * NOTA: Esta es una implementación de ejemplo
     * Necesitas instalar el paquete correspondiente
     */
    private function callAI($prompt)
    {
        // OPCIÓN 1: OpenAI (requiere composer require openai-php/client)
        /*
        $client = \OpenAI::client($this->apiKey);
        
        $response = $client->chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'Eres un asesor financiero experto.'],
                ['role' => 'user', 'content' => $prompt],
            ],
        ]);
        
        return $response->choices[0]->message->content;
        */

        // OPCIÓN 2: Gemini (gratuito) - Requiere configuración
        /*
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' . env('GEMINI_API_KEY');
        
        $response = Http::post($url, [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]);
        
        return $response->json()['candidates'][0]['content']['parts'][0]['text'];
        */

        // Por ahora, retornamos una respuesta simulada para que puedas probar
        return "⚠️ MODO DEMO - Instala OpenAI o Gemini para respuestas reales.\n\n" .
               "📊 ANÁLISIS SIMULADO:\n" .
               "Basándome en tus gastos, aquí hay algunas recomendaciones:\n\n" .
               "1. 🍔 Comida: Considera preparar comidas en casa 2-3 días/semana\n" .
               "2. 🚗 Transporte: Usa transporte público cuando sea posible\n" .
               "3. 💰 Ahorro: Intenta ahorrar al menos el 20% de tus ingresos\n\n" .
               "¡Vas por buen camino! 🎉";
    }
}
