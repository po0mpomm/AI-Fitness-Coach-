import { UserDetails } from "@/lib/types";

export function generateWorkoutPrompt(userDetails: UserDetails): string {
  return `You are an expert fitness coach. Generate a personalized 7-day workout plan for the following user:

Name: ${userDetails.name}
Age: ${userDetails.age}
Gender: ${userDetails.gender}
Height: ${userDetails.height} cm
Weight: ${userDetails.weight} kg
Fitness Goal: ${userDetails.fitnessGoal}
Fitness Level: ${userDetails.fitnessLevel}
Workout Location: ${userDetails.workoutLocation}
${userDetails.medicalHistory ? `Medical History: ${userDetails.medicalHistory}` : ""}
${userDetails.stressLevel ? `Stress Level: ${userDetails.stressLevel}` : ""}

Please generate a comprehensive 7-day workout plan with:
1. Daily exercise routines with specific exercises
2. Sets and reps for each exercise
3. Rest time between sets
4. Total workout duration for each day
5. Fitness tips (3-5 tips)
6. A motivational message

Format the response as JSON with this structure:
{
  "dailyRoutines": [
    {
      "day": "Day 1",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "10-12",
          "rest": "60 seconds",
          "description": "Brief description"
        }
      ],
      "restTime": "Rest day or active recovery",
      "totalDuration": "45 minutes"
    }
  ],
  "tips": ["tip1", "tip2", "tip3"],
  "motivation": "Motivational message"
}

Make sure exercises are appropriate for ${userDetails.workoutLocation} and ${userDetails.fitnessLevel} level.`;
}

export function generateDietPrompt(userDetails: UserDetails): string {
  const bmi = userDetails.weight / Math.pow(userDetails.height / 100, 2);
  const baseCalories = userDetails.gender === "Male" 
    ? 88.362 + (13.397 * userDetails.weight) + (4.799 * userDetails.height) - (5.677 * userDetails.age)
    : 447.593 + (9.247 * userDetails.weight) + (3.098 * userDetails.height) - (4.330 * userDetails.age);
  
  let targetCalories = baseCalories;
  if (userDetails.fitnessGoal === "Weight Loss") {
    targetCalories = baseCalories * 0.85;
  } else if (userDetails.fitnessGoal === "Muscle Gain") {
    targetCalories = baseCalories * 1.15;
  }

  return `You are an expert nutritionist. Generate a personalized 7-day diet plan for the following user:

Name: ${userDetails.name}
Age: ${userDetails.age}
Gender: ${userDetails.gender}
Height: ${userDetails.height} cm
Weight: ${userDetails.weight} kg
Fitness Goal: ${userDetails.fitnessGoal}
Dietary Preferences: ${userDetails.dietaryPreferences}
Target Daily Calories: ~${Math.round(targetCalories)} calories
${userDetails.medicalHistory ? `Medical History: ${userDetails.medicalHistory}` : ""}

Please generate a comprehensive 7-day meal plan with:
1. Breakfast, Lunch, Dinner, and 2 Snacks for each day
2. Specific quantities for each food item
3. Calorie count for each meal
4. Meal timing recommendations
5. Daily macro breakdown (protein, carbs, fats in grams)
6. Nutrition tips (3-5 tips)

Format the response as JSON with this structure:
{
  "meals": [
    {
      "day": "Day 1",
      "breakfast": {
        "items": [
          {
            "name": "Food Item",
            "quantity": "200g",
            "description": "Brief description"
          }
        ],
        "calories": 400,
        "timing": "8:00 AM"
      },
      "lunch": { ... },
      "dinner": { ... },
      "snacks": [
        { "items": [...], "calories": 150, "timing": "10:00 AM" },
        { "items": [...], "calories": 200, "timing": "4:00 PM" }
      ]
    }
  ],
  "dailyCalories": ${Math.round(targetCalories)},
  "macros": {
    "protein": 120,
    "carbs": 200,
    "fats": 60
  },
  "tips": ["tip1", "tip2", "tip3"]
}

Make sure all meals are ${userDetails.dietaryPreferences} and align with ${userDetails.fitnessGoal} goal.`;
}

export function generateMotivationQuotePrompt(): string {
  return `Generate a short, inspiring fitness motivation quote (1-2 sentences). Make it unique and encouraging. Return only the quote text, no JSON.`;
}

