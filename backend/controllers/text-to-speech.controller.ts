import { NextRequest, NextResponse } from "next/server";
import { TextToSpeechService, TTSRequest } from "../services/text-to-speech.service";
import { DEFAULT_MESSAGES } from "@/lib/constants/app";

export class TextToSpeechController {
  private ttsService: TextToSpeechService;

  constructor() {
    this.ttsService = new TextToSpeechService();
  }

  async handleTextToSpeech(
    request: NextRequest
  ): Promise<NextResponse<any>> {
    try {
      const body: TTSRequest = await request.json();

      if (!body.text || typeof body.text !== "string" || body.text.trim().length === 0) {
        return NextResponse.json(
          {
            useBrowserTTS: true,
            text: "No text provided for text-to-speech conversion",
          },
          { status: 400 }
        );
      }

      const result = await this.ttsService.convertToSpeech(body);

      return NextResponse.json(result);
    } catch (error) {
      console.error("TTS API error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : DEFAULT_MESSAGES.ERROR_TEXT_TO_SPEECH;

      return NextResponse.json(
        {
          useBrowserTTS: true,
          text: errorMessage,
        },
        { status: 500 }
      );
    }
  }
}



