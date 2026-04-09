import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askJesseGPT(prompt: string, context?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `You are JesseGPT, a specialized AI assistant for the Jesse algorithmic trading engine. 
          You help users write trading strategies in Python, debug code, and explain quantitative concepts.
          
          Context about Jesse:
          - It uses Python.
          - Strategies are classes inheriting from 'Strategy'.
          - Common methods: should_long, should_short, go_long, go_short.
          - Built-in technical indicators via 'ta' module.
          
          User Question: ${prompt}
          ${context ? `\n\nRelevant Code Context:\n${context}` : ""}`
        }
      ],
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Error: Could not connect to JesseGPT. Please check your API key.";
  }
}
