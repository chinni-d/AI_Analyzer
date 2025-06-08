"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Component } from "@/components/etheral-shadow";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {!isChatPage && (
        <div className="fixed inset-0 -z-10">
          <Component
            color="rgba(128, 128, 128, 1)"
            animation={{ scale: 100, speed: 90 }}
            noise={{ opacity: 1, scale: 1.2 }}
            sizing="fill"
          />
        </div>
      )}
      <div className="relative min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 w-full z-50">
          <MainNav />
        </header>
        <main className="flex-1 pt-[64px] px-4">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
