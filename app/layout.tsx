import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "@/components/layout-client"; // Import the new client component
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Document Analyzer",
  description:
    "AI-powered document question answering system using RAG architecture",
  manifest: "/site.webmanifest",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "theme-color": "#000000",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  function updateThemeColor() {
                    const isDark = document.documentElement.classList.contains('dark') || 
                                  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
                    const themeColor = isDark ? '#161616' : '#ffffff';
                    
                    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
                    if (!metaThemeColor) {
                      metaThemeColor = document.createElement('meta');
                      metaThemeColor.name = 'theme-color';
                      document.head.appendChild(metaThemeColor);
                    }
                    metaThemeColor.content = themeColor;
                  }
                  
                  updateThemeColor();
                  
                  // Update when theme changes
                  if (window.matchMedia) {
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeColor);
                  }
                  
                  // Also listen for class changes on html element
                  if (typeof MutationObserver !== 'undefined') {
                    const observer = new MutationObserver(updateThemeColor);
                    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
                  }
                })();
              `,
            }}
          />
        </head>
        <body className={inter.className}>
          <LayoutClient>{children}</LayoutClient>
        </body>
      </html>
    </ClerkProvider>
  );
}
