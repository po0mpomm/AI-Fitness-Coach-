import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/features/theme/theme-provider";
import { ThemeToggle } from "@/components/features/theme/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Fitness Coach - Personalized Workout & Diet Plans",
  description: "Get AI-powered personalized workout and diet plans tailored to your fitness goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}

