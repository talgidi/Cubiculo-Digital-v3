import 'dotenv/config';
//import OpenAI from 'openai';
// apps/api/src/core/ai/ai.service.ts
import 'dotenv/config';
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

export const aiService = {
  generateBusinessFeedback: async (userName: string, answers: { question: string, answer: string }[]) => {
    
    // 1. Formateo de datos profesional (Estructura 1 + 2)
    const formattedContext = answers
      .map((a, i) => `[Pregunta ${i + 1}]: ${a.question}\n[Respuesta]: "${a.answer}"`)
      .join('\n\n');

    try {
      const completion = await groq.chat.completions.create({
        // Usamos el modelo más potente y real de Groq
        model: "llama-3.3-70b-versatile", 
        messages: [
          {
            role: "system",
            content: `Eres un Consultor Senior de Estrategia Corporativa y experto en Business Intelligence. 
            Tu tarea es analizar la entrevista de ${userName} para generar su "Biblia Corporativa". 
            Debes ser crítico, profesional y proponer soluciones de alto impacto. 
            Estructura tu respuesta con: 
            1. Análisis de Situación Actual.
            2. Puntos Críticos de Mejora (Pain Points).
            3. Plan de Acción a 90 días (Paso a paso).`
          },
          {
            role: "user",
            content: `Aquí tienes el corpus de la entrevista para analizar:\n\n${formattedContext}`
          }
        ],
        // 0.5 es el "punto dulce": Creativo para dar ideas, pero serio para no inventar datos.
        temperature: 0.5, 
        max_tokens: 4096, // Aseguramos que el reporte no se corte
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        console.error("[GROQ_ERROR]: El modelo devolvió una respuesta vacía.");
        return null;
      }

      console.log(`[GROQ_SUCCESS]: Feedback generado para ${userName}`);
      return content;

    } catch (error) {
      console.error("[GROQ_CRITICAL_ERROR]:", error);
      return null;
    }
  }
};

/*const openai = new OpenAI({
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
        model: "gpt-4.1",
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
};*/
