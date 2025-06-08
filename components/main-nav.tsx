"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"; // Import the Next.js Image component
import { usePathname } from "next/navigation"
import { FileText, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Chat",
    href: "/chat",
  },
  {
    title: "About",
    href: "/about",
  },
]

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const handleNavItemClick = () => {
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile Menu Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] pr-0"
            onTouchStart={(e) => {
              e.currentTarget.dataset.dragStartX = String(e.touches[0].clientX);
            }}
            onTouchMove={(e) => {
              const startX = Number(e.currentTarget.dataset.dragStartX);
              const currentX = e.touches[0].clientX;
              if (startX - currentX > 60) {
                setOpen(false);
                e.currentTarget.dataset.dragStartX = undefined;
              }
            }}
          >
            <SheetTitle className="sr-only">Main Navigation</SheetTitle>
            <div className="flex flex-col space-y-6 py-4">
              <div className="flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2" onClick={handleNavItemClick}>
                  <Image src="/logo.png" alt="Document Analyzer Logo" width={28} height={28} className="h-7 w-7 invert dark:invert-0" /> 
                  <span className="font-semibold">Doc Analyzer</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <div className="px-2">
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavItemClick}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Document Analyzer Logo" width={32} height={32} className="h-8 w-8 invert dark:invert-0" />
            <span className="font-semibold hidden sm:inline-block">Document Analyzer</span>
            <span className="font-semibold sm:hidden">Doc Analyzer</span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.title}
              {pathname === item.href && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className="flex items-center flex-1 justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
