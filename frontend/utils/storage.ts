import { FitnessPlan } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants/app";

const STORAGE_KEY = STORAGE_KEYS.FITNESS_PLAN;

export function savePlanToStorage(plan: FitnessPlan): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }
}

export function getPlanFromStorage(): FitnessPlan | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as FitnessPlan;
      } catch (error) {
        console.error("Error parsing stored plan:", error);
        return null;
      }
    }
  }
  return null;
}

export function clearPlanFromStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

