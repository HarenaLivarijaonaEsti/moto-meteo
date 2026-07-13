import OpenAI from "openai";
import dotenv from "dotenv";

// fonction qui transforme la météo en prompt moto
dotenv.config();

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function InterpretationLLM(traduction) {
  try {
    // 1. appel OpenAI
    const response = await ai.responses.create({
      model: "gpt-4o",
      input: traduction,
    });

    // 2. résultat texte
    return response.output_text;

  } catch (error) {
    console.error("Erreur OpenAI:", error.message);
    return "Erreur LLM";
  }
}