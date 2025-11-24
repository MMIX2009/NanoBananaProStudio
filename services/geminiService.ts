import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (
  prompt: string,
  style: string,
  aspectRatio: AspectRatio,
  sourceImage?: string | null
): Promise<string> => {
  try {
    const parts: any[] = [];

    // If a source image is provided, add it to the content parts
    if (sourceImage) {
      // sourceImage is a data URL (e.g., "data:image/png;base64,...")
      // We need to extract the mimeType and the base64 data
      const [header, base64Data] = sourceImage.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';

      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      });
    }

    // Construct a rich prompt by combining the user's input with the selected style
    let finalPrompt = prompt;
    if (style && style !== "No Style") {
      finalPrompt = `${prompt}, in the style of ${style}, high quality, detailed`;
    }

    // Add the text prompt part
    parts.push({ text: finalPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // NanoBanana model alias
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    // Parse response to find the image part
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};