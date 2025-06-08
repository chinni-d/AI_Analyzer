import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "@/components/layout-client"; // Import the new client component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Document Analyzer",
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
        <LayoutClient>{children}</LayoutClient> 
      </body>
    </html>
  );
}
