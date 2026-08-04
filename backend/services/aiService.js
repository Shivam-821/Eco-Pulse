import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_VISION });

// Define this outside the function so it isn't recreated on every call
const FALLBACK_RESPONSE = {
  isWaste: false,
  wasteType: "Unknown",
  severity: 0,
  confidence: 0,
  summary: "AI Analysis Failed. Manual review required.",
};

const SYSTEM_PROMPT = `
You are an expert Environmental Waste Analyst.
Your task is to analyze images of potential waste/garbage dumps and provide structured data.

Output strictly in JSON format with the following fields:
1. isWaste (boolean): Is this image showing waste, garbage, or an environmental issue?
2. wasteType (string): "Organic", "Plastic", "E-Waste", "Construction", "Hazardous", "Mixed", or "None".
3. severity (number): 1-10 scale (1=Low/Small, 10=Severe/Large Dump).
4. confidence (number): 0-1 confidence score.
5. summary (string): A brief 1-sentence description of the waste.

If the image is NOT waste (e.g., a selfie, landscape, random object), set isWaste: false and severity: 0.
`;

export const analyzeWasteImage = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`Fetch failed with status: ${response.status} ${response.statusText}`);
      return FALLBACK_RESPONSE;
    }

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer) {
      console.error("Received empty buffer from image URL");
      return FALLBACK_RESPONSE;
    }

    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            isWaste: { type: "BOOLEAN" },
            wasteType: { type: "STRING" },
            severity: { type: "INTEGER" },
            confidence: { type: "NUMBER" },
            summary: { type: "STRING" },
          },
          required: ["isWaste", "wasteType", "severity", "confidence", "summary"],
        },
      },
    });

    const text = result.text;
    if (!text) {
      console.error("Empty response from AI model");
      return FALLBACK_RESPONSE;
    }

    return JSON.parse(text);
  } catch (error) {
    // Catches network errors, AI API errors, or JSON.parse errors
    console.error("AI Analysis Execution Error:", error.message);
    return FALLBACK_RESPONSE;
  }
};