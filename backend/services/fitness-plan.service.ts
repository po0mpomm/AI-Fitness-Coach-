import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import {
  generateWorkoutPrompt,
  generateDietPrompt,
  generateMotivationQuotePrompt,
} from "./ai-prompts";
import { UserDetails, WorkoutPlan, DietPlan } from "@/lib/types";
import { GEMINI_CONFIG } from "@/lib/constants/ai-models";
import { DEFAULT_MESSAGES } from "@/lib/constants/app";

export class FitnessPlanService {
  private validateApiKey(): void {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Google AI API key is not configured. " +
        "Please add GOOGLE_AI_API_KEY to your .env.local file in the project root and restart the server."
      );
    }

    if (apiKey.trim().length < 20) {
      throw new Error(
        "Google AI API key appears to be invalid. " +
        "Please check that your GOOGLE_AI_API_KEY in .env.local is correct and restart the server."
      );
    }

    if (apiKey.includes("your_") || apiKey.includes("example") || apiKey.includes("placeholder")) {
      throw new Error(
        "Google AI API key appears to be a placeholder. " +
        "Please replace it with your actual API key from https://makersuite.google.com/app/apikey"
      );
    }
  }

  private initializeGeminiClient(): GoogleGenerativeAI {
    this.validateApiKey();
    const apiKey = process.env.GOOGLE_AI_API_KEY!;
    return new GoogleGenerativeAI(apiKey);
  }

  private createGeminiModel(
    genAI: GoogleGenerativeAI,
    temperature: number,
    maxOutputTokens?: number
  ): GenerativeModel {
    return genAI.getGenerativeModel({
      model: GEMINI_CONFIG.MODEL_NAME,
      generationConfig: {
        temperature,
        ...(maxOutputTokens && { maxOutputTokens }),
      },
    });
  }

  private parseJsonResponse<T>(rawText: string, errorMessage: string): T {
    try {
      const cleanedText = rawText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      return JSON.parse(cleanedText) as T;
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      console.error("Raw AI response:", rawText);
      throw new Error(
        `${errorMessage}. The AI response may not be valid JSON. Please try again.`
      );
    }
  }

  async generateWorkoutPlan(
    model: GenerativeModel,
    userDetails: UserDetails
  ): Promise<WorkoutPlan> {
    const workoutPrompt = generateWorkoutPrompt(userDetails);
    const fullPrompt = `You are an expert fitness coach. Always respond with valid JSON only, no markdown formatting.

${workoutPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text() || "{}";

    return this.parseJsonResponse<WorkoutPlan>(
      responseText,
      "Failed to parse workout plan"
    );
  }

  async generateDietPlan(
    model: GenerativeModel,
    userDetails: UserDetails
  ): Promise<DietPlan> {
    const dietPrompt = generateDietPrompt(userDetails);
    const fullPrompt = `You are an expert nutritionist. Always respond with valid JSON only, no markdown formatting.

${dietPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text() || "{}";

    return this.parseJsonResponse<DietPlan>(
      responseText,
      "Failed to parse diet plan"
    );
  }

  async generateMotivationQuote(model: GenerativeModel): Promise<string> {
    try {
      const quotePrompt = generateMotivationQuotePrompt();
      const result = await model.generateContent(quotePrompt);
      const quoteText = result.response.text()?.trim();

      return quoteText || DEFAULT_MESSAGES.MOTIVATION_QUOTE;
    } catch (error) {
      console.error("Failed to generate motivation quote:", error);
      return DEFAULT_MESSAGES.MOTIVATION_QUOTE;
    }
  }

  async generateFitnessPlan(userDetails: UserDetails): Promise<{
    workoutPlan: WorkoutPlan;
    dietPlan: DietPlan;
    motivationQuote: string;
  }> {
    const genAI = this.initializeGeminiClient();

    const workoutModel = this.createGeminiModel(
      genAI,
      GEMINI_CONFIG.TEMPERATURE_WORKOUT
    );
    const quoteModel = this.createGeminiModel(
      genAI,
      GEMINI_CONFIG.TEMPERATURE_QUOTE,
      GEMINI_CONFIG.MAX_OUTPUT_TOKENS_QUOTE
    );

    const [workoutPlan, dietPlan, motivationQuote] = await Promise.all([
      this.generateWorkoutPlan(workoutModel, userDetails),
      this.generateDietPlan(workoutModel, userDetails),
      this.generateMotivationQuote(quoteModel),
    ]);

    return {
      workoutPlan,
      dietPlan,
      motivationQuote,
    };
  }
}



