import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import {
  generateWorkoutPrompt,
  generateDietPrompt,
  generateMotivationQuotePrompt,
} from "@/lib/prompts/ai-prompts";
import { UserDetails, WorkoutPlan, DietPlan } from "@/lib/types";
import { GEMINI_CONFIG } from "@/lib/constants/ai-models";
import { DEFAULT_MESSAGES } from "@/lib/constants/app";


interface GeneratePlanResponse {
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  motivationQuote: string;
}

interface ErrorResponse {
  error: string;
}

function validateApiKey(): void {
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

function initializeGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_AI_API_KEY!;
  return new GoogleGenerativeAI(apiKey);
}

function createGeminiModel(
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

function parseJsonResponse<T>(rawText: string, errorMessage: string): T {
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

async function generateWorkoutPlan(
  model: GenerativeModel,
  userDetails: UserDetails
): Promise<WorkoutPlan> {
  const workoutPrompt = generateWorkoutPrompt(userDetails);
  const fullPrompt = `You are an expert fitness coach. Always respond with valid JSON only, no markdown formatting.

${workoutPrompt}`;

  const result = await model.generateContent(fullPrompt);
  const responseText = result.response.text() || "{}";

  return parseJsonResponse<WorkoutPlan>(
    responseText,
    "Failed to parse workout plan"
  );
}

async function generateDietPlan(
  model: GenerativeModel,
  userDetails: UserDetails
): Promise<DietPlan> {
  const dietPrompt = generateDietPrompt(userDetails);
  const fullPrompt = `You are an expert nutritionist. Always respond with valid JSON only, no markdown formatting.

${dietPrompt}`;

  const result = await model.generateContent(fullPrompt);
  const responseText = result.response.text() || "{}";

  return parseJsonResponse<DietPlan>(
    responseText,
    "Failed to parse diet plan"
  );
}

async function generateMotivationQuote(model: GenerativeModel): Promise<string> {
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

export async function POST(
  request: NextRequest
): Promise<NextResponse<GeneratePlanResponse | ErrorResponse>> {
  try {
    validateApiKey();

    const body: any = await request.json();
    const userDetails: UserDetails = body.userDetails || body;

    if (!userDetails || !userDetails.name || !userDetails.age || !userDetails.gender) {
      return NextResponse.json(
        { error: "User details are required to generate a fitness plan" },
        { status: 400 }
      );
    }

    const genAI = initializeGeminiClient();

    const workoutModel = createGeminiModel(
      genAI,
      GEMINI_CONFIG.TEMPERATURE_WORKOUT
    );
    const quoteModel = createGeminiModel(
      genAI,
      GEMINI_CONFIG.TEMPERATURE_QUOTE,
      GEMINI_CONFIG.MAX_OUTPUT_TOKENS_QUOTE
    );

    const [workoutPlan, dietPlan, motivationQuote] = await Promise.all([
      generateWorkoutPlan(workoutModel, userDetails),
      generateDietPlan(workoutModel, userDetails),
      generateMotivationQuote(quoteModel),
    ]);

    return NextResponse.json({
      workoutPlan,
      dietPlan,
      motivationQuote,
    });
  } catch (error) {
    console.error("Error generating fitness plan:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : DEFAULT_MESSAGES.ERROR_GENERATE_PLAN;

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
