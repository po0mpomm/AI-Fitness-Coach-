import { IMAGE_CONFIG } from "@/lib/constants/ai-models";
import { DEFAULT_MESSAGES } from "@/lib/constants/app";

export type ImageType = "exercise" | "food" | "generic";

export interface GenerateImageRequest {
  prompt: string;
  type?: ImageType;
}

export class ImageGenerationService {
  private enhancePromptForType(prompt: string, type?: ImageType): string {
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

  private generatePicsumUrl(prompt: string, type?: ImageType): string {
    const seed = Math.abs(prompt.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const width = 800;
    const height = 800;
    
    const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;
    console.log(`[Image Service] Generated URL for "${prompt}": ${url}`);
    return url;
  }

  private generatePlaceholderUrl(prompt: string): string {
    const encodedText = encodeURIComponent(prompt || "Image");
    return `${IMAGE_CONFIG.PLACEHOLDER_BASE_URL}/${IMAGE_CONFIG.SIZE}/${IMAGE_CONFIG.PLACEHOLDER_COLOR}/${IMAGE_CONFIG.PLACEHOLDER_TEXT_COLOR}?text=${encodedText}`;
  }

  async generateImage(request: GenerateImageRequest): Promise<string> {
    const { prompt, type } = request;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new Error(DEFAULT_MESSAGES.ERROR_IMAGE_GENERATION);
    }

    const originalPrompt = prompt.trim();
    console.log(`[Image Service] Request received - prompt: "${originalPrompt}", type: ${type}`);
    
    const picsumUrl = this.generatePicsumUrl(originalPrompt, type);
    console.log(`[Image Service] Returning URL: ${picsumUrl}`);
    
    return picsumUrl;
  }

  generatePlaceholder(prompt: string): string {
    return this.generatePlaceholderUrl(prompt);
  }
}



