"use client";

import React from "react";
import { usePathname } from "next/navigation";
// import { Component } from "@/components/etheral-shadow"; // Removed etheral-shadow
import { Tiles } from "@/components/tiles"; // Added Tiles
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";
  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Conditionally render Tiles background */}
      {!isChatPage && (
        <div
          className={cn(
            "fixed inset-0 -z-10" // Always visible if not chat page
          )}
        >
          <Tiles /> {/* Using Tiles component with default props */}
        </div>
      )}
      <div
        className={cn(
          "relative min-h-screen flex flex-col",
          // If Tiles are shown (i.e., not chat page), make background transparent
          // Otherwise, use theme background (for chat page)
          !isChatPage ? "bg-transparent" : "bg-background"
        )}
      >
        <header className="fixed top-0 left-0 w-full z-50">
          <MainNav />
        </header>
        <main className="flex-1 pt-[64px] px-4">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
