import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === "production";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function describeWeatherCode(code: number): { label: string; emoji: string; advice: string } {
  if (code === 0) {
    return { label: "Clear & sunny", emoji: "☀️", advice: "Bright skies today. Sunglasses and water are a good idea." };
  }
  if (code <= 3) {
    return { label: "Softly cloudy", emoji: "⛅", advice: "Mild skies today. A light layer is plenty." };
  }
  if (code <= 48) {
    return { label: "Misty & cool", emoji: "☁️", advice: "Looks cool and hazy. Take a cozy sweater or jacket." };
  }
  if (code <= 67 || (code >= 80 && code <= 82)) {
    return { label: "Rain showers", emoji: "🌧️", advice: "Rain is expected today. Bring an umbrella and waterproof shoes." };
  }
  if (code <= 77 || (code >= 85 && code <= 86)) {
    return { label: "Snowy chill", emoji: "❄️", advice: "Very chilly out. Bundle up with a warm coat and scarf." };
  }
  return { label: "Breezy storm", emoji: "🌩️", advice: "Changeable weather today. Stay cozy indoors if you can." };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, app: "BETTER" });
  });

  app.get("/api/weather", async (req, res) => {
    try {
      const lat = Number(req.query.lat);
      const lon = Number(req.query.lon);
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return res.status(400).json({ error: "Valid latitude and longitude are required." });
      }
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=1`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Weather service is temporarily unavailable.");
      }
      const data = await response.json();
      const tempC = Math.round(Number(data?.current?.temperature_2m ?? 18));
      const code = Number(data?.current?.weather_code ?? 2);
      const hiC = Math.round(Number(data?.daily?.temperature_2m_max?.[0] ?? tempC + 2));
      const loC = Math.round(Number(data?.daily?.temperature_2m_min?.[0] ?? tempC - 3));
      const info = describeWeatherCode(code);
      const tempAdvice =
        tempC <= 12
          ? "Chilly air today. Wear a warm coat."
          : tempC <= 20
            ? "Looks cool today. Take a light jacket."
            : tempC >= 30
              ? "Warm sunshine today. Dress light and bring water."
              : info.advice;

      return res.json({
        tempC,
        hiC,
        loC,
        weatherCode: code,
        condition: info.label,
        emoji: info.emoji,
        advice: code >= 51 ? info.advice : tempAdvice,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not load weather.";
      return res.status(500).json({ error: message });
    }
  });

  app.post(["/api/ask-better", "/api/ask-butter"], async (req, res) => {
    try {
      const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
      const currency = typeof req.body?.currency === "string" ? req.body.currency : "IQD";
      const language = typeof req.body?.language === "string" ? req.body.language : "English";
      const scheduleContext = typeof req.body?.scheduleContext === "string" ? req.body.scheduleContext : "";

      if (!prompt) {
        return res.status(400).json({ error: "Please share what is on your mind first." });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API key is not configured yet. Add GEMINI_API_KEY in Settings > Secrets to use Ask BETTER.",
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: `Preferred UI language: ${language}\nUser currency: ${currency}\nCurrent context: ${scheduleContext}\n\nUser input: "${prompt}"`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction:
            "You are BETTER, a warm, gentle everyday companion. You fluently understand all supported languages (English, Arabic including regional dialects like Iraqi/Levantine/Gulf such as 'ذكرني أشتري شامبو باچر', Kurdish Sorani such as 'سبەی بیرم بخەرەوە شامپۆ بکڕم', Turkish, Spanish, French, German, Korean, Japanese, Chinese) AND mixed-language sentences (e.g., 'I need to buy دفتر tomorrow'). Extract the user's practical intent: tasks/events, reminders (including recurring like 'every Sunday' or location-based like 'when I arrive at shop'), shopping list items, Pack & Go checklists, notes, routines, or spending entries. Keep item titles natural in the user's language/words, and write 'reply' (1-2 warm sentences) and 'clarificationQuestion' (only if truly ambiguous) in the Preferred UI language. Never make decisions on sensitive personal, medical, financial, or legal matters—keep suggestions practical and user-controlled.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: "Warm, concise reply from BETTER (1-2 sentences) in the user's preferred UI language.",
              },
              clarificationQuestion: {
                type: Type.STRING,
                description: "Optional brief question if an important detail like time or place is genuinely ambiguous.",
              },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    timeLabel: { type: Type.STRING },
                    bucket: { type: Type.STRING, description: "today, tomorrow, or week" },
                    destination: {
                      type: Type.STRING,
                      description: "plan, shopping, note, money, or reminder",
                    },
                    category: {
                      type: Type.STRING,
                      description: "school, homework, shopping, food, selfcare, errand, money, or general",
                    },
                    reminder: { type: Type.BOOLEAN },
                    recurrence: { type: Type.STRING, description: "once, daily, weekly, sunday, or monthly" },
                    locationTrigger: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    note: { type: Type.STRING },
                  },
                  required: ["title", "timeLabel", "bucket", "destination", "category", "reminder"],
                },
              },
            },
            required: ["reply", "items"],
          },
        },
      });

      const rawText = (response.text ?? "{}").trim();
      return res.json(JSON.parse(rawText));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not process your request right now.";
      const status = message.includes("403") || message.includes("API_KEY") ? 401 : 500;
      return res.status(status).json({ error: message });
    }
  });

  app.post("/api/make-day-easier", async (req, res) => {
    try {
      const tasks = Array.isArray(req.body?.tasks) ? req.body.tasks : [];
      const language = typeof req.body?.language === "string" ? req.body.language : "English";
      if (tasks.length === 0) {
        return res.json({
          summary: "Your day is already light and open!",
          orderedSteps: [],
        });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API key is not configured yet. Add GEMINI_API_KEY in Settings > Secrets to use Make my day easier.",
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: `Preferred UI language: ${language}\nOrganize these tasks for today into a gentle, realistic step-by-step order with tiny helpful tips: ${JSON.stringify(tasks)}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction:
            "You are BETTER, a calm everyday companion. Suggest a practical, stress-free order for the user's tasks today. Respond in the Preferred UI language. Group nearby errands or time-bound items logically and add a tiny 1-line encouraging tip for each step.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              orderedSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    taskId: { type: Type.STRING },
                    title: { type: Type.STRING },
                    suggestedWindow: { type: Type.STRING },
                    tip: { type: Type.STRING },
                  },
                  required: ["title", "suggestedWindow", "tip"],
                },
              },
            },
            required: ["summary", "orderedSteps"],
          },
        },
      });

      const rawText = (response.text ?? "{}").trim();
      return res.json(JSON.parse(rawText));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not organize your day right now.";
      return res.status(500).json({ error: message });
    }
  });

  app.post("/api/suggest-pack-list", async (req, res) => {
    try {
      const activity = typeof req.body?.activity === "string" ? req.body.activity.trim() : "";
      const language = typeof req.body?.language === "string" ? req.body.language : "English";
      if (!activity) {
        return res.status(400).json({ error: "Please enter an activity or trip name." });
      }
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API key is not configured yet. Add GEMINI_API_KEY in Settings > Secrets.",
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: `Preferred UI language: ${language}\nSuggest 5 to 7 concise, practical items to pack for: "${activity}". Write items in the Preferred UI language (or matching the activity language).`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              items: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["items"],
          },
        },
      });

      const rawText = (response.text ?? "{}").trim();
      return res.json(JSON.parse(rawText));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not suggest items right now.";
      return res.status(500).json({ error: message });
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(
      express.static(distDir, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith("sw.js") || filePath.endsWith("registerSW.js")) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          } else if (filePath.endsWith("manifest.webmanifest")) {
            res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
            res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
          }
        },
      })
    );
    app.get("/{*path}", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BETTER server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
