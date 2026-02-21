
import { GoogleGenAI } from "@google/genai";
import { Santri, Setoran } from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Define a custom error for quota exhaustion
export class QuotaExceededError extends Error {
  constructor(message = "Gemini API quota exceeded. Please check your billing details.") {
    super(message);
    this.name = "QuotaExceededError";
  }
}

const callGeminiWithRetry = async (prompt: string, retries = 3, initialDelay = 2000): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let currentDelay = initialDelay;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{text: prompt}], // Ensure contents is an array of parts as per guidelines
        config: {
          maxOutputTokens: 100, // Limit output tokens for short motivation
        }
      });
      return response.text || "";
    } catch (error: any) {
      // Check for 429 error or RESOURCE_EXHAUSTED status
      const isRateLimit = error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED');
      
      if (isRateLimit && i < retries - 1) {
        console.warn(`Gemini Rate Limit hit. Retrying in ${currentDelay}ms... (Attempt ${i + 1}/${retries})`);
        await sleep(currentDelay);
        currentDelay *= 2; // Exponential backoff
        continue;
      }
      
      console.error("Gemini API Error:", error);
      if (isRateLimit) {
        throw new QuotaExceededError(); // Throw custom error for quota issues
      }
      throw error; // Re-throw other errors
    }
  }
  // This line should ideally not be reached if retries are exhausted and an error occurred
  throw new QuotaExceededError(); // Fallback in case loop finishes unexpectedly without throwing
};

export const getSmartInsights = async (santri: Santri, latestSetoran: Setoran[]) => {
  const prompt = `
    Berikan motivasi singkat (maksimal 3 kalimat) dalam Bahasa Indonesia untuk santri bernama ${santri.name}.
    Progress saat ini: ${santri.totalJuz} Juz dan ${santri.totalSurah} Surah.
    Setoran terakhir: Surah ${latestSetoran[0]?.surah || 'Baru Mulai'} status ${latestSetoran[0]?.status || 'N/A'}.
    Gunakan gaya bahasa yang menyemangati, bijak, dan islami. Fokus pada keutamaan menjaga Al-Quran.
  `;

  try {
    const text = await callGeminiWithRetry(prompt);
    return text;
  } catch (error) {
    if (error instanceof QuotaExceededError) {
      throw error; // Re-throw to be caught by App.tsx
    }
    console.error("Error getting smart insights:", error);
    return "Tetap semangat menghafal Al-Qur'an, semoga Allah mudahkan langkahmu menjadi Ahlul Qur'an.";
  }
};
