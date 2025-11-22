import { NextRequest, NextResponse } from "next/server";
import { IMAGE_CONFIG } from "@/lib/constants/ai-models";
import { DEFAULT_MESSAGES } from "@/lib/constants/app";

type ImageType = "exercise" | "food" | "generic";

interface GenerateImageRequest {
  prompt: string;
  type?: ImageType;
}

interface GenerateImageResponse {
  imageUrl: string;
}

interface ErrorResponse {
  error: string;
}

function enhancePromptForType(prompt: string, type?: ImageType): string {
  if (!type) {
    return prompt;
  }

  const enhancements: Record<ImageType, string> = {
    exercise: `Professional fitness photography of ${prompt}, realistic gym setting, high quality, detailed, well-lit`,
    food: `Professional food photography of ${prompt}, appetizing, high quality, detailed, well-lit, food styling`,
    generic: prompt,
  };

  return enhancements[type];
}

function generatePicsumUrl(prompt: string, type?: ImageType): string {
  const seed = Math.abs(prompt.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const width = 800;
  const height = 800;
  
  const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;
  console.log(`[Image API] Generated URL for "${prompt}": ${url}`);
  return url;
}

function generatePlaceholderUrl(prompt: string): string {
  const encodedText = encodeURIComponent(prompt || "Image");
  return `${IMAGE_CONFIG.PLACEHOLDER_BASE_URL}/${IMAGE_CONFIG.SIZE}/${IMAGE_CONFIG.PLACEHOLDER_COLOR}/${IMAGE_CONFIG.PLACEHOLDER_TEXT_COLOR}?text=${encodedText}`;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateImageResponse | ErrorResponse>> {
  let originalPrompt = "";

  try {
    const body: GenerateImageRequest = await request.json();
    const { prompt, type } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: DEFAULT_MESSAGES.ERROR_IMAGE_GENERATION },
        { status: 400 }
      );
    }

    originalPrompt = prompt.trim();
    console.log(`[Image API] Request received - prompt: "${originalPrompt}", type: ${type}`);
    
    const picsumUrl = generatePicsumUrl(originalPrompt, type);
    console.log(`[Image API] Returning URL: ${picsumUrl}`);
    
    return NextResponse.json({ imageUrl: picsumUrl });
  } catch (error) {
    console.error("Image generation error:", error);

    const placeholderUrl = generatePlaceholderUrl(originalPrompt);
    return NextResponse.json(
      {
        imageUrl: placeholderUrl,
      },
      { status: 500 }
    );
  }
}
