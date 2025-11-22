import { GoogleGenAI } from "@google/genai";
import { SearchResult, SearchSource } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const performSmartSearch = async (query: string): Promise<SearchResult> => {
  if (!apiKey) {
    return {
      text: "API Key is missing. Please check your configuration.",
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a helpful personal assistant integrated into a dashboard. Provide concise, accurate answers. If the user asks for a quick fact, give it directly. If the user asks a complex question, summarize the answer found from the search tools."
      },
    });

    const text = response.text || "No result found.";
    
    // Extract grounding chunks for sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: SearchSource[] = [];

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Web Source",
            uri: chunk.web.uri,
          });
        }
      });
    }

    return {
      text,
      sources: sources.length > 0 ? sources : undefined,
    };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return {
      text: "Sorry, I encountered an error while searching. Please try again later.",
    };
  }
};