"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Component } from "@/components/etheral-shadow";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";
  const isHomePage = pathname === "/";
  const isAboutPage = pathname === "/about";

  // Determine if the special background should be shown
  const showSpecialBackground = !isChatPage; // Show on all pages except chat by default

  // Determine if the plain white background should be forced for light mode
  const forceWhiteBackgroundLight = isHomePage || isAboutPage;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {showSpecialBackground && (
        <div
          className={cn(
            "fixed inset-0 -z-10",
            forceWhiteBackgroundLight && "dark:block hidden" // Hide special bg in light mode for home/about
          )}
        >
          <Component
            color="rgba(128, 128, 128, 1)"
            animation={{ scale: 100, speed: 90 }}
            noise={{ opacity: 1, scale: 1.2 }}
            sizing="fill"
          />
        </div>
      )}
      <div
        className={cn(
          "relative min-h-screen flex flex-col",
          forceWhiteBackgroundLight && "bg-white dark:bg-transparent" // Apply white bg in light, transparent in dark for home/about
        )}
      >
        <header className="fixed top-0 left-0 w-full z-50">
          <MainNav />
        </header>
        <main className="flex-1 pt-[64px] px-4">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
