import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Check if Gemini is enabled/configured
app.get("/api/gemini/status", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({ configured: hasKey });
});

// Chat / Inquiry endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: "El mensaje es obligatorio." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: "🚨 *El Consultor IA de Santería e Ifá está en modo demostración.* Para habilitar la sabiduría completa del Oráculo Gemini, por favor configura tu clave secreta `GEMINI_API_KEY` en el menú **Settings > Secrets** de AI Studio.\n\nMientras tanto, puedes seguir explorando las secciones de Orishas, Patakis, Libros y Videos que he preparado para ti, ¡y editarlos como desees!",
        demo: true
      });
    }

    const ai = getGeminiClient();

    // Map chatHistory to contents format required by Gemini API if provided
    const systemPrompt = `Eres un sabio y respetuoso Consultor de Religiones Afrocubanas (Regla de Osha-Ifá o Santería, Ifá y Regla de Palo Monte o Palo Mayombe). Tu propósito es educar y aclarar dudas de los creyentes, estudiantes e iniciados de manera respetuosa, ética y verídica, basándote en la teología yoruba, los tratados de Ifá y las tradiciones bantúes del Palo Mayombe.

Instrucciones claves de respuesta:
1. Responde de forma respetuosa, objetiva, misteriosa y sabia (puedes empezar usando saludos tradicionales como "¡Alafia!", "¡Iboru Iboya Ibosheshe!" para asuntos de Ifá, o "¡Nsala Malekum!" para asuntos de Palo Mayombe).
2. Explica claramente la diferencia entre la Santería (Osha), Ifá (el culto a Orula/Orunmila) y el Palo Mayombe cuando el usuario pregunte o sea pertinente.
3. El tono debe ser de apoyo para el aprendizaje y estudio religioso. Recuerda que los Patakis son historias sagradas con gran valor moral y filosófico.
4. Explica el significado religioso, los atributos religiosos, colores emblemáticos, comidas/ofrendas (addimú), números sagrados y collares de los Orishas principales cuando te pregunten.
5. Mantén tus respuestas limpias, estructuradas en Markdown y en español. Evita revelar información secreta prohibida para no iniciados de manera irrespetuosa, pero sí brinda toda la información doctrinal e histórica de dominio educativo público.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.75,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Error interno al consultar el Oráculo. Por favor intenta de nuevo.",
      details: error.message
    });
  }
});

// Setup Vite middleware in Development mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Ayé Portal Backend] Server listening on http://localhost:${PORT}`);
  });
}

startServer();
