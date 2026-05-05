import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
// fonction qui transforme la météo en prompt moto
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function InterpretationLLM(traduction) {
  try {


    // 1. appel Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: traduction,
    });

    // 2. résultat texte
    return response.text;

  } catch (error) {
    console.error("Erreur Gemini:", error.message);
    return "Erreur LLM";
  }
}