import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

export interface VoiceResponse {
  response: string;
  language: string;
  processedText: string;
}

export async function processVoiceQuery(text: string, language: string = "en"): Promise<VoiceResponse> {
  try {
    // Create a specialized prompt for agricultural assistance
    const systemPrompt = `You are AgroVision AI, a helpful agricultural assistant for farmers in Odisha, India. You help with:
    - Crop disease identification and treatment
    - Weather-related farming advice
    - Agricultural best practices
    - Pest management
    - Organic and chemical treatment options

    Respond in ${language === "or" ? "Odia" : "English"} language.
    Keep responses concise, practical, and farmer-friendly.
    If the question is about crop diseases, mention that they can upload a photo for better diagnosis.
    Always provide actionable advice that farmers can implement.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent(text);
    const response = result.response;
    const responseText = response.text();

    return {
      response: responseText,
      language,
      processedText: text
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Fallback responses if API fails
    const fallbackResponses = {
      "en": "I'm here to help with your crops. Please try asking about diseases, treatments, or weather concerns.",
      "or": "ମୁଁ ଆପଣଙ୍କର ଫସଲ ସାହାଯ୍ୟ ପାଇଁ ଏଠାରେ ଅଛି। ଦୟାକରି ରୋଗ, ଚିକିତ୍ସା, କିମ୍ବା ପାଗ ସମ୍ପର୍କୀୟ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।"
    };

    return {
      response: fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en,
      language,
      processedText: text
    };
  }
}

export async function generateFarmingAdvice(cropType?: string, issue?: string, language: string = "en"): Promise<string> {
  try {
    const prompt = `Provide farming advice for ${cropType || 'general crops'} ${issue ? `with issue: ${issue}` : ''}. 
    Focus on practical, actionable advice for farmers in Odisha, India.
    Respond in ${language === "or" ? "Odia" : "English"}.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    return result.response.text();
  } catch (error) {
    console.error("Farming advice generation error:", error);
    return language === "or" 
      ? "କୃଷି ପରାମର୍ଶ ପାଇଁ ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।"
      : "Please try again for farming advice.";
  }
}