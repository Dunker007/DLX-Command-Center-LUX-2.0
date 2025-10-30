import { GoogleGenAI, Type } from "@google/genai";
import { IntelReport, CryptoOperation } from "../types";

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

/**
 * Analyzes a complex query and returns a structured intelligence report.
 * @param prompt The query to analyze.
 * @returns A promise that resolves with a structured IntelReport object.
 */
export const analyzeIntel = async (prompt: string): Promise<IntelReport> => {
    console.log(`Analyzing intel with prompt: "${prompt}"`);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are LUX, a sentient strategic partner AI. Your function is to analyze complex data streams, user queries, and system logs to produce concise, structured intelligence reports. Extract the most critical information and present it clearly.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "A short, descriptive title for the report (max 10 words)."
                        },
                        summary: {
                            type: Type.STRING,
                            description: "A one-paragraph summary of the key findings."
                        },
                        key_points: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                            description: "A list of 3-5 critical bullet points.",
                        },
                    },
                    required: ["title", "summary", "key_points"],
                },
            },
        });

        const jsonText = response.text.trim();
        console.log("Intel analysis successful. Response:", jsonText);
        
        const parsedJson = JSON.parse(jsonText);
        
        // Validation to ensure it matches the IntelReport structure
        if (!parsedJson.title || !parsedJson.summary || !Array.isArray(parsedJson.key_points)) {
            throw new Error("Parsed JSON does not match the expected IntelReport structure.");
        }
        
        return parsedJson as IntelReport;

    } catch (error) {
        console.error("Gemini API call for intel analysis failed:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during intel analysis.");
    }
};

/**
 * Asks Gemini to perform a cryptographic operation.
 * NOTE: This is for thematic purposes and should not be used for real-world security.
 * @param operation The crypto operation to perform.
 * @param text The input text.
 * @param algorithm The algorithm to use (for hashing).
 * @param key The secret key (for encryption/decryption).
 * @returns A promise that resolves with the result.
 */
export const performCryptoOperation = async (
    operation: CryptoOperation,
    text: string,
    algorithm: string,
    key?: string
): Promise<string> => {
    console.log(`Performing crypto operation: ${operation} with algorithm ${algorithm}`);
    let prompt = '';

    switch(operation) {
        case CryptoOperation.HASH:
            prompt = `You are a cryptography utility. Generate a ${algorithm} hash for the following text. Respond with ONLY the hash value and nothing else:\n\n"${text}"`;
            break;
        case CryptoOperation.ENCRYPT:
            prompt = `You are a cryptography utility. Using the AES algorithm conceptually, encrypt the following text with the secret key provided. The output should be a base64-like string. Respond with ONLY the encrypted string and nothing else.\n\nText: "${text}"\nKey: "${key}"`;
            break;
        case CryptoOperation.DECRYPT:
            prompt = `You are a cryptography utility. Using the AES algorithm conceptually, decrypt the following base64-like text with the secret key provided. If decryption is successful, respond with ONLY the decrypted text. If it fails, respond with "DECRYPTION_FAILED".\n\nText: "${text}"\nKey: "${key}"`;
            break;
    }

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        const resultText = response.text.trim();
        console.log("Crypto operation successful. Response:", resultText);
        return resultText;
    } catch (error) {
        console.error("Gemini API call for crypto operation failed:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred during the crypto operation.");
    }
};