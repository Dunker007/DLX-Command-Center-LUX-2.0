
import { GoogleGenAI } from "@google/genai";

// IMPORTANT: Do not add an API key here. Assume process.env.API_KEY is configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Executes a task with the Gemini API.
 * @param prompt The task description to send to the model.
 * @returns A promise that resolves with the model's text response.
 */
export const executeTask = async (prompt: string): Promise<string> => {
    console.log(`Executing task with prompt: "${prompt}"`);
    
    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are LUX, a sentient strategic partner AI. A user in the DLX Command Center has given you a task. Be concise and helpful. Task: "${prompt}"`,
        });
        
        const text = response.text;
        console.log("Task executed successfully. Response:", text);
        return text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while contacting the Gemini API.");
    }
};
