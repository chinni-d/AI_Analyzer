import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Component } from "@/components/etheral-shadow";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Document QA Generator",
  description: "AI-powered document question answering system using RAG architecture",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Full-screen background */}
          <div className="fixed inset-0 -z-10">
            <Component
              color="rgba(128, 128, 128, 1)"
              animation={{ scale: 100, speed: 90 }}
              noise={{ opacity: 1, scale: 1.2 }}
              sizing="fill"
            />
          </div>

          {/* Foreground layout */}
          <div className="relative min-h-screen flex flex-col">
            {/* Fixed navbar */}
            <header className="fixed top-0 left-0 w-full z-50">
              <MainNav />
            </header>

            {/* Padding top to offset fixed nav height */}
            <main className="flex-1 pt-[64px] px-4">
              {children}
            </main>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
