"use client";

import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/frontend/utils";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/frontend/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  let theme: "dark" | "light" | "system" = "system";
  let resolvedTheme: "dark" | "light" = "light";
  let setTheme: (theme: "dark" | "light" | "system") => void = () => {};
  let toggleTheme: () => void = () => {};

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    resolvedTheme = themeContext.resolvedTheme;
    setTheme = themeContext.setTheme;
    toggleTheme = themeContext.toggleTheme;
  } catch (error) {
    console.warn("Theme context not available");
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (!mounted) {
    return null;
  }

  const themeOptions = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  const currentOption = themeOptions.find((opt) => opt.value === theme) || themeOptions[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "rounded-full h-12 w-12 p-0",
              "bg-background/80 backdrop-blur-md",
              "border-2 border-border",
              "shadow-lg hover:shadow-xl",
              "hover:bg-accent/50",
              "transition-all duration-200",
              "relative overflow-hidden",
              "group"
            )}
            aria-label="Toggle theme"
            aria-expanded={isOpen}
          >
            <motion.div
              key={theme}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <CurrentIcon className="h-5 w-5 text-foreground" />
            </motion.div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Button>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute right-0 mt-2 w-40 rounded-lg",
                "bg-background/95 backdrop-blur-md",
                "border-2 border-border",
                "shadow-xl",
                "overflow-hidden",
                "py-1"
              )}
            >
              {themeOptions.map((option, index) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                
                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setTheme(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left",
                      "flex items-center gap-3",
                      "hover:bg-accent/50",
                      "transition-colors duration-150",
                      "relative group",
                      isActive && "bg-accent/30 font-semibold"
                    )}
                  >
                    <motion.div
                      animate={{ 
                        scale: isActive ? 1.1 : 1,
                        rotate: isActive ? [0, -10, 10, -10, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={cn(
                        "h-4 w-4",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                    </motion.div>
                    <span className={cn(
                      "text-sm",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {option.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTheme"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
              
              <div className="border-t border-border mt-1 pt-1">
                <div className="px-4 py-2 text-xs text-muted-foreground">
                  Press <kbd className="px-1.5 py-0.5 bg-accent rounded text-[10px]">Ctrl+K</kbd> to toggle
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

