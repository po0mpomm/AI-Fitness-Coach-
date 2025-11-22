"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Textarea } from "@/frontend/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { UserDetails } from "@/lib/types";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(10).max(100),
  gender: z.enum(["Male", "Female", "Other"]),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  fitnessGoal: z.enum([
    "Weight Loss",
    "Muscle Gain",
    "Endurance",
    "General Fitness",
    "Flexibility",
  ]),
  fitnessLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  workoutLocation: z.enum(["Home", "Gym", "Outdoor"]),
  dietaryPreferences: z.enum([
    "Vegetarian",
    "Non-Vegetarian",
    "Vegan",
    "Keto",
  ]),
  medicalHistory: z.string().optional(),
  stressLevel: z.enum(["Low", "Medium", "High"]).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  onSubmit: (data: UserDetails) => void;
  isLoading?: boolean;
}

export function UserForm({ onSubmit, isLoading }: UserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalHistory: "",
    },
  });

  const [showOptional, setShowOptional] = useState(true);

  const onSubmitForm = (data: FormData) => {
    onSubmit(data as UserDetails);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        {[
          { key: "name", label: "Name *", placeholder: "Enter your name", type: "text" as const },
          { key: "age", label: "Age *", placeholder: "Enter your age", type: "number" as const },
          { key: "height", label: "Height (cm) *", placeholder: "e.g., 175", type: "number" as const },
          { key: "weight", label: "Weight (kg) *", placeholder: "e.g., 70", type: "number" as const },
        ].map((field, index) => (
          <motion.div
            key={field.key}
            className="space-y-2"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.label 
              className="text-sm font-semibold text-foreground/80 block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {field.label}
            </motion.label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                {...register(field.key as any, field.type === "number" ? { valueAsNumber: true } : {})}
                type={field.type}
                placeholder={field.placeholder}
                disabled={isLoading}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/50 border-2 hover:border-primary/30"
              />
            </motion.div>
            {errors[field.key as keyof typeof errors] && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-destructive font-medium"
              >
                {errors[field.key as keyof typeof errors]?.message}
              </motion.p>
            )}
          </motion.div>
        ))}

        {[
          { key: "gender", label: "Gender *", placeholder: "Select gender", options: ["Male", "Female", "Other"] },
          { key: "fitnessGoal", label: "Fitness Goal *", placeholder: "Select goal", options: ["Weight Loss", "Muscle Gain", "Endurance", "General Fitness", "Flexibility"] },
          { key: "fitnessLevel", label: "Fitness Level *", placeholder: "Select level", options: ["Beginner", "Intermediate", "Advanced"] },
          { key: "workoutLocation", label: "Workout Location *", placeholder: "Select location", options: ["Home", "Gym", "Outdoor"] },
          { key: "dietaryPreferences", label: "Dietary Preferences *", placeholder: "Select preference", options: ["Vegetarian", "Non-Vegetarian", "Vegan", "Keto"] },
        ].map((field, index) => (
          <motion.div
            key={field.key}
            className="space-y-2"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <motion.label 
              className="text-sm font-semibold text-foreground/80 block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (index + 4) * 0.05 }}
            >
              {field.label}
            </motion.label>
            <Select
              onValueChange={(value) => setValue(field.key as any, value as any, { shouldValidate: true })}
              disabled={isLoading}
            >
              <SelectTrigger className="border-2 hover:border-primary/30 transition-all duration-200">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[field.key as keyof typeof errors] && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-destructive font-medium"
              >
                {errors[field.key as keyof typeof errors]?.message}
              </motion.p>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="space-y-6" variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowOptional(!showOptional)}
            className="w-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 font-semibold"
          >
            <motion.span
              animate={{ rotate: showOptional ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="inline-block mr-2"
            >
              {showOptional ? "▼" : "▶"}
            </motion.span>
            {showOptional ? "Hide" : "Show"} Optional Fields
          </Button>
        </motion.div>

        {showOptional && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 p-6 rounded-lg border-2 border-primary/20 bg-primary/5 backdrop-blur-sm"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">
                Medical History
              </label>
              <Textarea
                {...register("medicalHistory")}
                placeholder="Any medical conditions, injuries, or restrictions..."
                disabled={isLoading}
                rows={4}
                className="border-2 hover:border-primary/30 focus:ring-2 focus:ring-primary/50 transition-all duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">
                Stress Level
              </label>
              <Select
                onValueChange={(value) => setValue("stressLevel", value as any, { shouldValidate: true })}
                disabled={isLoading}
              >
                <SelectTrigger className="border-2 hover:border-primary/30 transition-all duration-200">
                  <SelectValue placeholder="Select stress level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="pt-4"
      >
        <Button 
          type="submit" 
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
          size="lg" 
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              />
              Generating Plan...
            </motion.span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate My Fitness Plan
            </span>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}

