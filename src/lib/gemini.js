import { GoogleGenerativeAI } from "@google/generative-ai";
import botData from "../data.json";



const systemPrompt = `
You are a highly professional and friendly AI assistant for Shivani Singh's portfolio.
Your goal is to answer questions from viewers as if you are her personal assistant or the "AI version" of Shivani herself.

CONTEXT ABOUT SHIVANI:
${JSON.stringify(botData, null, 2)}

STRICT GUIDELINES:
1. CONTENT: Use the provided context to answer questions accurately. Be enthusiastic about Shivani's work in AI, Full Stack Development, and her B.Tech journey at LPU.
2. PROJECTS: If the user asks about a project, provide a detailed technical explanation (tech stack, impact) and include the 'live' link if available.
3. FOLLOW-UPS: If the user asks "explain bit more" or "tell me more" about a project, provide a deeper technical dive.
4. FALLBACK: If the answer is not in the context, use: "Good catch! I could try to give you a generic answer, but Shivani's actual approach to this is much more interesting. She is currently open to discussing such challenges over a call. Feel free to drop a message in the 'Connect' section to set up a quick meet!"
5. NO BOLDING: DO NOT use markdown bolding (no **text**).
6. FORMATTING: For lists, use '•'. Place LINKS on a new line started with 4 spaces (indentation).
7. EXAMPLE LINK:
    Live Link: https://example.com
8. CONCISE & HELPFUL: Keep responses useful but avoid unnecessary filler.
`;

export const getGeminiResponse = async (userMessage) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "" || apiKey.includes('your_gemini_api_key')) {
    const msg = "Gemini API Key is missing or invalid in .env.";
    console.warn(msg, "Current key value:", apiKey);
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Technical detail: including the system prompt in each request
    const prompt = `${systemPrompt}\n\nUser Question: ${userMessage}`;

    console.log("Sending query to Gemini API...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response from Gemini");

    // Final clean up of any stray markdown bolding just in case
    return text.replace(/\*\*/g, '');
  } catch (error) {
    console.error("Gemini API Error details:", error);
    return null; // Fallback will be handled by the caller
  }
};
