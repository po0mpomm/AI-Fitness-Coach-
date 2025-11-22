import { ELEVENLABS_CONFIG } from "@/lib/constants/api";
import { DEFAULT_MESSAGES } from "@/lib/constants/app";

export interface TTSRequest {
  text: string;
}

export interface TTSResponse {
  useBrowserTTS: boolean;
  text?: string;
  audio?: string;
  mimeType?: string;
}

export class TextToSpeechService {
  async generateElevenLabsAudio(text: string): Promise<{
    success: boolean;
    audio?: string;
  }> {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return { success: false };
    }

    try {
      const response = await fetch(ELEVENLABS_CONFIG.API_URL, {
        method: "POST",
        headers: {
          Accept: ELEVENLABS_CONFIG.MIME_TYPE,
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: ELEVENLABS_CONFIG.MODEL_ID,
          voice_settings: {
            stability: ELEVENLABS_CONFIG.STABILITY,
            similarity_boost: ELEVENLABS_CONFIG.SIMILARITY_BOOST,
          },
        }),
      });

      if (!response.ok) {
        console.warn(
          `ElevenLabs API request failed: ${response.status} ${response.statusText}`
        );
        return { success: false };
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString("base64");

      return {
        success: true,
        audio: base64Audio,
      };
    } catch (error) {
      console.error("ElevenLabs API error:", error);
      return { success: false };
    }
  }

  async convertToSpeech(request: TTSRequest): Promise<TTSResponse> {
    const { text } = request;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return {
        useBrowserTTS: true,
        text: "No text provided for text-to-speech conversion",
      };
    }

    const elevenLabsResult = await this.generateElevenLabsAudio(text);

    if (elevenLabsResult.success && elevenLabsResult.audio) {
      return {
        useBrowserTTS: false,
        audio: elevenLabsResult.audio,
        mimeType: ELEVENLABS_CONFIG.MIME_TYPE,
      };
    }

    return {
      useBrowserTTS: true,
      text: text.trim(),
    };
  }
}



