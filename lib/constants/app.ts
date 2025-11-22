export const DEFAULT_MESSAGES = {
  MOTIVATION_QUOTE: "Every expert was once a beginner. Every pro was once an amateur. Keep going!",
  ERROR_GENERATE_PLAN: "An unexpected error occurred while generating your fitness plan. Please try again.",
  ERROR_TEXT_TO_SPEECH: "Unable to process text-to-speech request",
  ERROR_IMAGE_GENERATION: "Please provide a description of the image you want to generate",
} as const;

export const STORAGE_KEYS = {
  FITNESS_PLAN: "fitness_plan",
  THEME: "theme",
} as const;

