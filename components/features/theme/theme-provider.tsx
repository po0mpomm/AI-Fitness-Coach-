"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && (stored === "dark" || stored === "light" || stored === "system")) {
      setTheme(stored);
    } else {
      setTheme(defaultTheme);
    }
  }, [defaultTheme]);

  React.useEffect(() => {
    if (!mounted) return;

    const updateResolvedTheme = () => {
      let newResolvedTheme: ResolvedTheme;
      
      if (theme === "system") {
        newResolvedTheme = getSystemTheme();
      } else {
        newResolvedTheme = theme;
      }

      setResolvedTheme(newResolvedTheme);

      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newResolvedTheme);
      
      if (theme !== "system") {
        localStorage.setItem("theme", theme);
      } else {
        localStorage.removeItem("theme");
      }
    };

    updateResolvedTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateResolvedTheme();
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, mounted]);

  React.useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.style.transition = "background-color 0.3s ease, color 0.3s ease";
    
    return () => {
      root.style.transition = "";
    };
  }, [mounted]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

