import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
  generateBusinessFeedback: async (userName: string, answers: { question: string, answer: string }[]) => {
    // 1. Estructuramos el contenido para la IA
    const context = answers.map(a => `Pregunta: ${a.question}\nRespuesta: ${a.answer}`).join('\n\n');

    const prompt = `
      Eres un consultor de negocios experto. Basado en las siguientes 11 respuestas de la entrevista de ${userName}, 
      genera un reporte estructurado "Biblia Corporativa" con:
      1. Análisis de situación actual.
      2. Puntos críticos de mejora.
      3. Plan de acción paso a paso a 90 días.
      
      Respuestas del cliente:
      ${context}
    `;

    try {
        const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview", // O gpt-3.5-turbo para ahorrar costos
        messages: [{ role: "system", content: prompt }],
        temperature: 0.7,
        });
      // Retornamos el contenido o lanzamos error si no hay respuesta
      return response.choices[0].message.content || null;
    } catch (error) {
      console.error("OpenAI Error:", error);
      return null;
    }
  }
};
