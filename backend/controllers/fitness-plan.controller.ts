import { NextRequest, NextResponse } from "next/server";
import { FitnessPlanService } from "../services/fitness-plan.service";
import { UserDetails } from "@/lib/types";
import { DEFAULT_MESSAGES } from "@/lib/constants/app";

interface GeneratePlanResponse {
  workoutPlan: any;
  dietPlan: any;
  motivationQuote: string;
}

interface ErrorResponse {
  error: string;
}

export class FitnessPlanController {
  private fitnessPlanService: FitnessPlanService;

  constructor() {
    this.fitnessPlanService = new FitnessPlanService();
  }

  async handleGeneratePlan(
    request: NextRequest
  ): Promise<NextResponse<GeneratePlanResponse | ErrorResponse>> {
    try {
      const body: any = await request.json();
      const userDetails: UserDetails = body.userDetails || body;

      if (!userDetails || !userDetails.name || !userDetails.age || !userDetails.gender) {
        return NextResponse.json(
          { error: "User details are required to generate a fitness plan" },
          { status: 400 }
        );
      }

      const result = await this.fitnessPlanService.generateFitnessPlan(userDetails);

      return NextResponse.json(result);
    } catch (error) {
      console.error("Error generating fitness plan:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : DEFAULT_MESSAGES.ERROR_GENERATE_PLAN;

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  }
}



