export const GEMINI_CONFIG = {
  MODEL_NAME: "gemini-2.0-flash",
  IMAGE_MODEL: "gemini-2.0-flash-exp-image-generation",
  TEMPERATURE_WORKOUT: 0.7,
  TEMPERATURE_QUOTE: 0.9,
  TEMPERATURE_IMAGE: 0.7,
  MAX_OUTPUT_TOKENS_QUOTE: 100,
} as const;

export const OPENAI_CONFIG = {
  MODEL: "dall-e-3",
  SIZE: "1024x1024",
  QUALITY: "standard",
  IMAGE_COUNT: 1,
} as const;

export const IMAGE_CONFIG = {
  SIZE: "1024x1024",
  UNSPLASH_BASE_URL: "https://source.unsplash.com",
  PLACEHOLDER_BASE_URL: "https://via.placeholder.com",
  PLACEHOLDER_COLOR: "4F46E5",
  PLACEHOLDER_TEXT_COLOR: "FFFFFF",
} as const;

