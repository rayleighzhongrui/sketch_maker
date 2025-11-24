import { GoogleGenAI } from "@google/genai";

/**
 * Generates a sketch image using Gemini 2.5 Flash Image (Nano Banana).
 * @param prompt The text description for the image.
 * @returns The base64 data URL of the generated image.
 */
export const generateSketchImage = async (prompt: string): Promise<string> => {
  try {
    // Instantiate the client inside the function to ensure we use the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Using 'gemini-2.5-flash-image' (Nano Banana)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        // Flash Image supports aspectRatio but NOT imageSize
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Iterate through parts to find the inlineData (image)
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          // Determine mimeType, default to image/png if not provided
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("生成响应中未包含图片数据");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "图片生成失败");
  }
};