"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserForm } from "@/components/features/user-input/user-form";
import { PlanDisplay } from "@/components/features/fitness-plan/plan-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserDetails, FitnessPlan } from "@/lib/types";
import { savePlanToStorage, getPlanFromStorage, clearPlanFromStorage } from "@/lib/utils/storage";
import { Dumbbell, UtensilsCrossed, Sparkles, Trash2 } from "lucide-react";

export default function Home() {
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedPlan = getPlanFromStorage();
    if (savedPlan) {
      setPlan(savedPlan);
    }
  }, []);

  const handleGeneratePlan = async (userDetails: UserDetails) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate plan");
      }

      const data = await response.json();
      const newPlan: FitnessPlan = {
        userDetails,
        workoutPlan: data.workoutPlan,
        dietPlan: data.dietPlan,
        generatedAt: new Date().toISOString(),
        motivationQuote: data.motivationQuote,
      };

      setPlan(newPlan);
      savePlanToStorage(newPlan);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating your plan");
      console.error("Error generating plan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (plan) {
      handleGeneratePlan(plan.userDetails);
    }
  };

  const handleClearPlan = () => {
    setPlan(null);
    clearPlanFromStorage();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.6
          }}
          className="text-center mb-16"
        >
          <motion.div 
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
            >
              <Dumbbell className="h-12 w-12 md:h-14 md:w-14 text-primary drop-shadow-lg" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent drop-shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              AI Fitness Coach
            </motion.h1>
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
                delay: 0.2
              }}
            >
              <Sparkles className="h-12 w-12 md:h-14 md:w-14 text-primary drop-shadow-lg" />
            </motion.div>
          </motion.div>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Get personalized workout and diet plans powered by AI. Tell us about
            yourself, and we'll create a plan tailored just for you.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            { icon: Dumbbell, title: "Personalized Workouts", desc: "AI-generated exercise routines based on your fitness level and goals", delay: 0.6 },
            { icon: UtensilsCrossed, title: "Custom Meal Plans", desc: "Nutrition plans tailored to your dietary preferences and calorie needs", delay: 0.7 },
            { icon: Sparkles, title: "AI-Powered Insights", desc: "Get tips, motivation, and guidance from our AI fitness coach", delay: 0.8 },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: feature.delay,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-card/50 backdrop-blur-sm">
                <CardHeader className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                  >
                    {React.createElement(feature.icon, { className: "h-10 w-10 text-primary mb-3 drop-shadow-md" })}
                  </motion.div>
                  <CardTitle className="text-xl font-bold relative z-10">{feature.title}</CardTitle>
                  <CardDescription className="text-base relative z-10">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {!plan ? (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.6,
              type: "spring",
              stiffness: 100
            }}
          >
            <Card className="border-2 shadow-2xl bg-card/80 backdrop-blur-md hover:shadow-primary/5 transition-shadow duration-300">
              <CardHeader className="text-center pb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Tell Us About Yourself
                  </CardTitle>
                  <CardDescription className="text-lg mt-3">
                    Fill in your details to get a personalized fitness plan
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <UserForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive border-2 border-destructive/30 backdrop-blur-sm"
                  >
                    <p className="font-semibold text-base">Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              duration: 0.5
            }}
            className="space-y-6"
          >
            <motion.div 
              className="flex justify-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleClearPlan}
                  variant="outline"
                  size="sm"
                  className="border-2 hover:border-destructive/50 hover:bg-destructive/10 transition-all duration-200"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Plan & Start Over
                </Button>
              </motion.div>
            </motion.div>
            <PlanDisplay
              plan={plan}
              onRegenerate={handleRegenerate}
              onPlanUpdate={(updatedPlan) => {
                setPlan(updatedPlan);
                savePlanToStorage(updatedPlan);
              }}
              isRegenerating={isLoading}
            />
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-5 rounded-xl bg-destructive/10 text-destructive border-2 border-destructive/30 backdrop-blur-sm shadow-lg"
              >
                <p className="font-semibold text-base mb-1">Error</p>
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
