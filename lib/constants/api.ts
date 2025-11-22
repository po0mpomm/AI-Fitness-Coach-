export const API_ENDPOINTS = {
  GENERATE_PLAN: "/api/generate-plan",
  GENERATE_IMAGE: "/api/generate-image",
  TEXT_TO_SPEECH: "/api/text-to-speech",
} as const;

export const API_KEYS = {
  GOOGLE_AI: "GOOGLE_AI_API_KEY",
  OPENAI: "OPENAI_API_KEY",
  ELEVENLABS: "ELEVENLABS_API_KEY",
} as const;

export const ELEVENLABS_CONFIG = {
  API_URL: "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
  VOICE_ID: "21m00Tcm4TlvDq8ikWAM",
  MODEL_ID: "eleven_monolingual_v1",
  STABILITY: 0.5,
  SIMILARITY_BOOST: 0.5,
  MIME_TYPE: "audio/mpeg",
} as const;

