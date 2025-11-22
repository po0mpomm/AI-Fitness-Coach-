export interface UserDetails {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  height: number;
  weight: number;
  fitnessGoal: "Weight Loss" | "Muscle Gain" | "Endurance" | "General Fitness" | "Flexibility";
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced";
  workoutLocation: "Home" | "Gym" | "Outdoor";
  dietaryPreferences: "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Keto";
  medicalHistory?: string;
  stressLevel?: "Low" | "Medium" | "High";
}

export interface WorkoutPlan {
  dailyRoutines: DailyRoutine[];
  tips: string[];
  motivation: string;
}

export interface DailyRoutine {
  day: string;
  exercises: Exercise[];
  restTime: string;
  totalDuration: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  description?: string;
  imageUrl?: string;
}

export interface DietPlan {
  meals: DailyMealPlan[];
  tips: string[];
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface DailyMealPlan {
  day: string;
  breakfast?: MealPlan;
  lunch?: MealPlan;
  dinner?: MealPlan;
  snacks?: MealPlan[];
}

export interface MealPlan {
  items: MealItem[];
  calories: number;
  timing: string;
}

export interface MealItem {
  name: string;
  quantity: string;
  description?: string;
  imageUrl?: string;
}

export interface FitnessPlan {
  userDetails: UserDetails;
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  generatedAt: string;
  motivationQuote: string;
}

