import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_VISION });

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
      console.error(
        `Fetch failed with status: ${response.status} ${response.statusText}`,
      );
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer) {
      throw new Error("Received empty buffer from image URL");
    }

    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-09-2025",
      contents: [
        {
          role: "user",
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    // console.log("AI Result:", JSON.stringify(result, null, 2));

    let text = null;

    // Try to extract text from various possible structures
    if (result.response && typeof result.response.text === "function") {
      text = result.response.text();
    } else if (typeof result.text === "function") {
      text = result.text();
    } else if (result.candidates && result.candidates.length > 0) {
      // Handle @google/genai SDK structure
      const candidate = result.candidates[0];
      if (
        candidate.content &&
        candidate.content.parts &&
        candidate.content.parts.length > 0
      ) {
        text = candidate.content.parts[0].text;
      }
    }

    if (!text) {
      console.error(
        "AI returned empty text response",
        JSON.stringify(result, null, 2),
      );
      throw new Error("Empty response from AI model");
    }

    // Validate JSON parsing
    try {
      const jsonResult = JSON.parse(text);
      return jsonResult;
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", text);
      // Fallback or retry logic could go here
      throw new Error("Invalid JSON response from AI");
    }
  } catch (error) {
    console.error("AI Analysis Failed:", error.message);
    // Explicitly return a fallback object to prevent undefined/crash
    return {
      isWaste: true,
      wasteType: "Unknown",
      severity: 1,
      confidence: 0,
      summary: "AI Analysis Failed. Manual review required.",
    };
  }
};
