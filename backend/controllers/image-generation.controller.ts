import { NextRequest, NextResponse } from "next/server";
import { ImageGenerationService, GenerateImageRequest } from "../services/image-generation.service";
import { DEFAULT_MESSAGES } from "@/lib/constants/app";

interface GenerateImageResponse {
  imageUrl: string;
}

interface ErrorResponse {
  error: string;
}

export class ImageGenerationController {
  private imageService: ImageGenerationService;

  constructor() {
    this.imageService = new ImageGenerationService();
  }

  async handleGenerateImage(
    request: NextRequest
  ): Promise<NextResponse<GenerateImageResponse | ErrorResponse>> {
    let originalPrompt = "";

    try {
      const body: GenerateImageRequest = await request.json();
      
      if (!body.prompt || typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
        return NextResponse.json(
          { error: DEFAULT_MESSAGES.ERROR_IMAGE_GENERATION },
          { status: 400 }
        );
      }

      originalPrompt = body.prompt.trim();
      const imageUrl = await this.imageService.generateImage(body);

      return NextResponse.json({ imageUrl });
    } catch (error) {
      console.error("Image generation error:", error);

      const placeholderUrl = this.imageService.generatePlaceholder(originalPrompt);
      return NextResponse.json(
        {
          imageUrl: placeholderUrl,
        },
        { status: 500 }
      );
    }
  }
}



