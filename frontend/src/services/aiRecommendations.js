import axios from 'axios';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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';

export async function getAIRecommendations(userStats = []) {
  // Limitar a las 10 transacciones más recientes
  const recentTx = Array.isArray(userStats) ? userStats.slice(-10) : userStats;
  const prompt = `Devuélveme 4 recomendaciones financieras en formato JSON con esta estructura:
[
  { "id": 1, "type": "warning", "title": "...", "description": "...", "impact": "alto", "savings": 800 },
  ...
]
SOLO puedes usar los datos de las transacciones que te paso, no inventes montos ni categorías. Si no hay suficiente información, responde con recomendaciones genéricas pero nunca inventes datos. Datos del usuario: ${JSON.stringify(recentTx)}
`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'meta-llama/llama-3-8b-instruct',
      messages: [
        { role: 'system', content: 'Eres un asistente financiero experto. Responde solo con el JSON solicitado y solo tenes que dar opiniones de los gastos no de los ingresos.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.2
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://openrouter.ai/',
        'X-Title': 'Recomendaciones Financieras'
      }
    }
  );
  // Extrae el JSON de la respuesta
  const text = response.data.choices[0]?.message?.content || '[]';
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}
