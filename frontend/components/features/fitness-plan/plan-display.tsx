"use client";

import { useState } from "react";
import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { FitnessPlan, Exercise, MealItem } from "@/lib/types";
import { Volume2, Download, RefreshCw, Image as ImageIcon, Play, Pause, RotateCcw, Dumbbell, UtensilsCrossed } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/frontend/utils";

interface PlanDisplayProps {
  plan: FitnessPlan;
  onRegenerate: () => void;
  onPlanUpdate?: (updatedPlan: FitnessPlan) => void;
  isRegenerating?: boolean;
}

export function PlanDisplay({ plan, onRegenerate, onPlanUpdate, isRegenerating }: PlanDisplayProps) {
  const [playingSection, setPlayingSection] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [generatingImages, setGeneratingImages] = useState<Set<string>>(new Set());
  
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const sectionTextRef = React.useRef<{ text: string; section: string } | null>(null);

  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (utteranceRef.current) {
        speechSynthesis.cancel();
        utteranceRef.current = null;
      }
    };
  }, []);

  const handleTextToSpeech = async (text: string, section: string) => {
    handleStop();
    
    sectionTextRef.current = { text, section };
    setPlayingSection(section);
    setIsPaused(false);
    
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, section }),
      });

      const data = await response.json();

      if (data.useBrowserTTS) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utteranceRef.current = utterance;
        
        utterance.onend = () => {
          setPlayingSection(null);
          setIsPaused(false);
          utteranceRef.current = null;
        };
        
        utterance.onerror = () => {
          setPlayingSection(null);
          setIsPaused(false);
          utteranceRef.current = null;
        };
        
        speechSynthesis.speak(utterance);
      } else {
        const audio = new Audio(`data:${data.mimeType};base64,${data.audio}`);
        audioRef.current = audio;
        
        audio.onended = () => {
          setPlayingSection(null);
          setIsPaused(false);
          audioRef.current = null;
        };
        
        audio.onerror = () => {
          setPlayingSection(null);
          setIsPaused(false);
          audioRef.current = null;
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error("TTS error:", error);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utteranceRef.current = utterance;
      
      utterance.onend = () => {
        setPlayingSection(null);
        setIsPaused(false);
        utteranceRef.current = null;
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
    } else if (utteranceRef.current && speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else if (utteranceRef.current && speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleRestart = () => {
    if (sectionTextRef.current) {
      handleStop();
      setTimeout(() => {
        handleTextToSpeech(sectionTextRef.current!.text, sectionTextRef.current!.section);
      }, 100);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (utteranceRef.current) {
      speechSynthesis.cancel();
      utteranceRef.current = null;
    }
    setPlayingSection(null);
    setIsPaused(false);
  };

  const handleGenerateImage = async (item: Exercise | MealItem, type: "exercise" | "food") => {
    const key = `${type}-${item.name}`;
    if (generatingImages.has(key) || item.imageUrl) return;

    setGeneratingImages((prev) => new Set(prev).add(key));
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: item.name, type }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate image" }));
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      console.log("Image generation response:", data);
      
      if (data && data.imageUrl) {
        console.log("Image URL received:", data.imageUrl);
        let updatedPlan: FitnessPlan;
        
        if (type === "exercise") {
          updatedPlan = {
            ...plan,
            workoutPlan: {
              ...plan.workoutPlan,
              dailyRoutines: plan.workoutPlan.dailyRoutines.map((routine) => ({
                ...routine,
                exercises: routine.exercises.map((ex) =>
                  ex.name === item.name ? { ...ex, imageUrl: data.imageUrl } : ex
                ),
              })),
            },
          };
        } else {
          updatedPlan = {
            ...plan,
            dietPlan: {
              ...plan.dietPlan,
              meals: plan.dietPlan.meals.map((dailyMeal) => ({
                ...dailyMeal,
                breakfast: dailyMeal.breakfast
                  ? {
                      ...dailyMeal.breakfast,
                      items: dailyMeal.breakfast.items.map((mi) =>
                        mi.name === item.name ? { ...mi, imageUrl: data.imageUrl } : mi
                      ),
                    }
                  : undefined,
                lunch: dailyMeal.lunch
                  ? {
                      ...dailyMeal.lunch,
                      items: dailyMeal.lunch.items.map((mi) =>
                        mi.name === item.name ? { ...mi, imageUrl: data.imageUrl } : mi
                      ),
                    }
                  : undefined,
                dinner: dailyMeal.dinner
                  ? {
                      ...dailyMeal.dinner,
                      items: dailyMeal.dinner.items.map((mi) =>
                        mi.name === item.name ? { ...mi, imageUrl: data.imageUrl } : mi
                      ),
                    }
                  : undefined,
                snacks: dailyMeal.snacks?.map((snack) => ({
                  ...snack,
                  items: snack.items.map((mi) =>
                    mi.name === item.name ? { ...mi, imageUrl: data.imageUrl } : mi
                  ),
                })),
              })),
            },
          };
        }
        
        if (onPlanUpdate) {
          onPlanUpdate(updatedPlan);
        }
        
        item.imageUrl = data.imageUrl;
        console.log("Image URL set:", data.imageUrl);
      } else {
        console.error("No image URL returned from API:", data);
      }
    } catch (error) {
      console.error("Image generation error:", error);
    } finally {
      setGeneratingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const handleExportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;

    const element = document.getElementById("plan-content");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgScaledWidth = imgWidth * ratio;
    const imgScaledHeight = imgHeight * ratio;

    pdf.addImage(imgData, "PNG", 0, 0, imgScaledWidth, imgScaledHeight);
    pdf.save(`fitness-plan-${plan.userDetails.name}-${Date.now()}.pdf`);
  };

  const workoutText = JSON.stringify(plan.workoutPlan, null, 2);
  const dietText = JSON.stringify(plan.dietPlan, null, 2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="space-y-8" 
      id="plan-content"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 p-8 border-2 border-primary/30 shadow-xl backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.05)_50%,transparent_70%)]"></div>
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-center"
          >
            <p className="text-xl md:text-2xl font-semibold italic text-foreground drop-shadow-md">
              "{plan.motivationQuote}"
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex flex-wrap gap-4 items-center justify-center md:justify-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {playingSection === "workout" ? (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {isPaused ? (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={handleResume}
                    variant="outline"
                    size="sm"
                    className="border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    size="sm"
                    className="border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="sm"
                  className="border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restart
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={handleStop}
                  variant="outline"
                  size="sm"
                  className="border-2 hover:border-destructive/50 hover:bg-destructive/10 transition-all duration-200"
                >
                  Stop
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handleTextToSpeech(workoutText, "workout")}
                variant="outline"
                className="border-2 hover:border-primary hover:bg-primary/10 hover:shadow-lg transition-all duration-200 font-semibold"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                </motion.div>
                Read Workout Plan
              </Button>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {playingSection === "diet" ? (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {isPaused ? (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={handleResume}
                    variant="outline"
                    size="sm"
                    className="border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    size="sm"
                    className="border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="sm"
                  className="border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restart
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={handleStop}
                  variant="outline"
                  size="sm"
                  className="border-2 hover:border-destructive/50 hover:bg-destructive/10 transition-all duration-200"
                >
                  Stop
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => handleTextToSpeech(dietText, "diet")}
                variant="outline"
                className="border-2 hover:border-primary hover:bg-primary/10 hover:shadow-lg transition-all duration-200 font-semibold"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                </motion.div>
                Read Diet Plan
              </Button>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={handleExportPDF} 
            variant="outline"
            className="border-2 hover:border-primary hover:bg-primary/10 hover:shadow-lg transition-all duration-200 font-semibold"
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onRegenerate}
            variant="outline"
            disabled={isRegenerating}
            className="border-2 hover:border-primary hover:bg-primary/10 hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50"
          >
            <motion.div
              animate={isRegenerating ? { rotate: 360 } : {}}
              transition={isRegenerating ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
            </motion.div>
            Regenerate Plan
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs.Root defaultValue="workout" className="space-y-6">
          <Tabs.List className="flex space-x-4 border-b-2 border-border/50 bg-card/50 backdrop-blur-sm p-2 rounded-t-xl">
            <Tabs.Trigger
              value="workout"
              className="px-6 py-3 font-bold text-base border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary transition-all duration-300 hover:text-primary/70 relative group"
            >
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Dumbbell className="h-5 w-5" />
                Workout Plan
              </motion.span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="diet"
              className="px-6 py-3 font-bold text-base border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary transition-all duration-300 hover:text-primary/70 relative group"
            >
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <UtensilsCrossed className="h-5 w-5" />
                Diet Plan
              </motion.span>
            </Tabs.Trigger>
          </Tabs.List>

        <Tabs.Content value="workout" className="space-y-4">
          {plan.workoutPlan.dailyRoutines.map((routine, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{routine.day}</CardTitle>
                  <CardDescription>
                    Duration: {routine.totalDuration} | Rest: {routine.restTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {routine.exercises.map((exercise, exIdx) => (
                      <motion.div
                        key={exIdx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 + exIdx * 0.05 + 0.3 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="p-5 rounded-xl border-2 hover:border-primary/40 bg-card/50 hover:bg-card/80 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <motion.h4 
                              className="font-bold text-xl text-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: exIdx * 0.05 }}
                            >
                              {exercise.name}
                            </motion.h4>
                            <div className="flex flex-wrap gap-3 text-sm font-medium">
                              <motion.span 
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                                whileHover={{ scale: 1.1 }}
                              >
                                {exercise.sets} Sets
                              </motion.span>
                              <motion.span 
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                                whileHover={{ scale: 1.1 }}
                              >
                                {exercise.reps} Reps
                              </motion.span>
                              <motion.span 
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                                whileHover={{ scale: 1.1 }}
                              >
                                Rest: {exercise.rest}
                              </motion.span>
                            </div>
                            {exercise.description && (
                              <motion.p 
                                className="text-sm text-muted-foreground mt-3 leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: exIdx * 0.05 + 0.2 }}
                              >
                                {exercise.description}
                              </motion.p>
                            )}
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleGenerateImage(exercise, "exercise")
                              }
                              disabled={generatingImages.has(
                                `exercise-${exercise.name}`
                              )}
                              className="h-10 w-10 rounded-full border-2 hover:border-primary hover:bg-primary/10 transition-all duration-200 disabled:opacity-50"
                            >
                              {generatingImages.has(`exercise-${exercise.name}`) ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <ImageIcon className="h-4 w-4" />
                                </motion.div>
                              ) : (
                                <ImageIcon className="h-5 w-5" />
                              )}
                            </Button>
                          </motion.div>
                        </div>
                        {exercise.imageUrl && (
                          <motion.img
                            src={exercise.imageUrl}
                            alt={exercise.name}
                            className="mt-5 rounded-xl w-full max-w-md shadow-lg border-2 border-primary/20"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 100,
                              damping: 15
                            }}
                            whileHover={{ scale: 1.02 }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {plan.workoutPlan.tips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fitness Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {plan.workoutPlan.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Motivation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="italic">{plan.workoutPlan.motivation}</p>
            </CardContent>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Nutrition</CardTitle>
              <CardDescription>
                Calories: {plan.dietPlan.dailyCalories} kcal | Protein:{" "}
                {plan.dietPlan.macros.protein}g | Carbs:{" "}
                {plan.dietPlan.macros.carbs}g | Fats:{" "}
                {plan.dietPlan.macros.fats}g
              </CardDescription>
            </CardHeader>
          </Card>

          {plan.dietPlan.meals.map((dailyMeal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{dailyMeal.day || `Day ${idx + 1}`}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dailyMeal.breakfast && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Breakfast</h4>
                        <span className="text-sm text-muted-foreground">
                          {dailyMeal.breakfast.calories} kcal • {dailyMeal.breakfast.timing}
                        </span>
                      </div>
                      {dailyMeal.breakfast.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-3 rounded-lg border bg-card flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}
                            </p>
                            {item.description && (
                              <p className="text-sm mt-1">{item.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleGenerateImage(item, "food")}
                            disabled={generatingImages.has(`food-${item.name}`)}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {dailyMeal.lunch && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Lunch</h4>
                        <span className="text-sm text-muted-foreground">
                          {dailyMeal.lunch.calories} kcal • {dailyMeal.lunch.timing}
                        </span>
                      </div>
                      {dailyMeal.lunch.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-3 rounded-lg border bg-card flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}
                            </p>
                            {item.description && (
                              <p className="text-sm mt-1">{item.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleGenerateImage(item, "food")}
                            disabled={generatingImages.has(`food-${item.name}`)}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {dailyMeal.dinner && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Dinner</h4>
                        <span className="text-sm text-muted-foreground">
                          {dailyMeal.dinner.calories} kcal • {dailyMeal.dinner.timing}
                        </span>
                      </div>
                      {dailyMeal.dinner.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="p-3 rounded-lg border bg-card flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}
                            </p>
                            {item.description && (
                              <p className="text-sm mt-1">{item.description}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleGenerateImage(item, "food")}
                            disabled={generatingImages.has(`food-${item.name}`)}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {dailyMeal.snacks && dailyMeal.snacks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Snacks</h4>
                      {dailyMeal.snacks.map((snack, snackIdx) => (
                        <div key={snackIdx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Snack {snackIdx + 1}</span>
                            <span className="text-sm text-muted-foreground">
                              {snack.calories} kcal • {snack.timing}
                            </span>
                          </div>
                          {snack.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="p-3 rounded-lg border bg-card flex items-start justify-between"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity}
                                </p>
                                {item.description && (
                                  <p className="text-sm mt-1">{item.description}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleGenerateImage(item, "food")}
                                disabled={generatingImages.has(`food-${item.name}`)}
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {plan.dietPlan.tips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {plan.dietPlan.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </Tabs.Content>
      </Tabs.Root>
      </motion.div>
    </motion.div>
  );
}

