# Instalación e integración de IA (OpenRouter) en Recommendations

## 1. Registro y obtención de API Key
- Ve a https://openrouter.ai/
- Regístrate y genera una API Key gratuita.

## 2. Instalación de dependencias
- En la terminal, ejecuta:

```
npm install axios
```

## 3. Creación del servicio de IA
- Crea el archivo `src/services/aiRecommendations.js` con este contenido:

```js
import axios from 'axios';

const OPENROUTER_API_KEY = 'TU_API_KEY_AQUI'; // Reemplaza por tu API Key

export async function getAIRecommendations(userStats = []) {
  // Limitar a las 10 transacciones más recientes
  const recentTx = Array.isArray(userStats) ? userStats.slice(-10) : userStats;
  const prompt = `Devuélveme 4 recomendaciones financieras en formato JSON con esta estructura:\n[
    { "id": 1, "type": "warning", "title": "...", "description": "...", "impact": "alto", "savings": 800 },
    ...
  ]\nUsa los siguientes datos del usuario (últimas 10 transacciones): ${JSON.stringify(recentTx)}\n`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'meta-llama/llama-3-8b-instruct',
      messages: [
        { role: 'system', content: 'Eres un asistente financiero experto. Responde solo con el JSON solicitado.' },
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
```

## 4. Uso en Recommendations.jsx
- Importa y usa la función en tu componente:

```js
import { getAIRecommendations } from '../services/aiRecommendations';
import { transactionService } from '../services/api';

// ...
useEffect(() => {
  async function fetchAIRecommendations() {
    // Obtén las transacciones del usuario
    const txResult = await transactionService.getAll();
    const transactions = txResult.data || [];
    // Pide recomendaciones a la IA
    const aiRecs = await getAIRecommendations(transactions);
    setRecommendations(aiRecs);
  }
  fetchAIRecommendations();
}, []);
```

## 5. Consideraciones
- El uso es gratuito hasta el límite de tu API Key.
- Si superas el límite, la API dejará de responder hasta el próximo ciclo o hasta que agregues un método de pago.
- Puedes personalizar el prompt para obtener recomendaciones más específicas.

---

¡Listo! Así se integra una IA gratuita usando OpenRouter en tu proyecto React.
