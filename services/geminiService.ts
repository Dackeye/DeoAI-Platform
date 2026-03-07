import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getBusinessAdvice = async (
  query: string,
  context: string = "general"
): Promise<{ text: string; sources: { title: string; uri: string }[] }> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are NEO, an intelligent business consultant for Gen Z entrepreneurs. 
    Your tone is modern, encouraging, professional, and concise.
    Context: ${context}.
    
    FORMATTING RULES:
    - Use Markdown for your response.
    - Use **bold** for key terms or emphasis.
    - Use bullet points for lists of steps or items.
    - Use '### ' for section headers if the response is long.
    
    ADVICE GUIDELINES:
    - Provide actionable, specific advice avoiding generic jargon.
    - If the context is 'finance', focus on profitability, cash flow, and risk.
    - If the context is 'compliance', focus on Nigerian/African business laws but keep it applicable globally where possible.
    - If the context is 'marketing', focus on viral strategies, brand identity, and engagement.
    - ALWAYS USE THE SEARCH TOOL to get the most current information, especially for regulations, rates, or trends.`;

    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 } // Low latency preferred for chat
      }
    });

    const text = response.text || "I couldn't generate a response right now. Please try again.";
    
    // Extract sources from grounding metadata
    const sources: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Source',
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return {
      text: "I'm having trouble connecting to the neural network. Please check your connection.",
      sources: []
    };
  }
};

export const optimizeSocialPost = async (content: string, platform: string): Promise<string> => {
  try {
    const prompt = `Rewrite the following social media post for ${platform}. 
    Make it engaging, use appropriate emojis, and include 3 relevant hashtags.
    Target audience: Gen Z and Millennial customers.
    Original Content: "${content}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || content;
  } catch (error) {
    console.error("Gemini Social Error:", error);
    return content;
  }
};

export const analyzeFinancials = async (dataSummary: string): Promise<string> => {
  try {
    const prompt = `Analyze this financial summary for a small business: ${dataSummary}. 
    Provide 3 bullet points on how to cut costs or increase revenue. Keep it under 100 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Unable to analyze data.";
  } catch (error) {
    console.error("Financial Analysis Error", error);
    return "Analysis unavailable.";
  }
};

export const parseReceiptWithValidation = async (
  base64Image: string,
  mimeType: string
): Promise<{ 
  isFinancialStatement: boolean; 
  data?: { clientName: string; amount: number; date: string; items: any[] };
  error?: string;
}> => {
  try {
    const prompt = `Analyze the attached image. 
    1. Determine if this is a financial statement, receipt, or invoice. 
    2. If it is NOT a financial document (e.g., just a random photo, a landscape, a person), return JSON: {"isFinancialStatement": false}.
    3. If it IS a financial document, extract the client/vendor name, total amount, and date. 
    Return JSON: {"isFinancialStatement": true, "data": {"clientName": "...", "amount": 0.00, "date": "YYYY-MM-DD", "items": []}}.
    
    Be strict. Only respond with the JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Receipt Parsing Error:", error);
    return { isFinancialStatement: false, error: "Failed to process image." };
  }
};
