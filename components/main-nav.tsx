"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image";
import { usePathname } from "next/navigation"
import { Menu, X, HomeIcon, MessageSquare, Info, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator" // Import Separator
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

const navItems = [
  {
    title: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [activeIndicator, setActiveIndicator] = React.useState({ left: 0, width: 0 })
  const [isAnimating, setIsAnimating] = React.useState(false)
  const navRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current) return
      
      const activeLink = navRef.current.querySelector(`[data-href="${pathname}"]`) as HTMLElement
      if (activeLink) {
        const navRect = navRef.current.getBoundingClientRect()
        const linkRect = activeLink.getBoundingClientRect()
        
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        // Start animation
        setIsAnimating(true)
        
        setActiveIndicator({
          left: linkRect.left - navRect.left,
          width: linkRect.width
        })
        
        // End animation after transition completes
        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false)
        }, 500)
      }
    }

    if (mounted) {
      // Update immediately
      updateIndicator()
      
      // Update on resize
      window.addEventListener('resize', updateIndicator)
      return () => {
        window.removeEventListener('resize', updateIndicator)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [pathname, mounted])

  const handleNavItemClick = () => {
    setOpen(false)
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getThemeIcon = () => {
    if (!mounted) return Sun
    if (theme === "dark") return Moon
    return Sun
  }

  const ThemeIcon = getThemeIcon()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-64 p-0 md:w-[240px] bg-white dark:bg-[#0a0a0a] border-r border-border/50"
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
            <div className="flex flex-col h-full">
              {/* Header Section */}
              <div className="px-4 py-4 border-b border-border/20">
                <Link href="/" className="flex items-center gap-2" onClick={handleNavItemClick}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                    <Image 
                      src="/logo.png" 
                      alt="AI Analyzer Logo" 
                      width={20} 
                      height={20} 
                      className="h-5 w-5 invert dark:invert-0" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-foreground">AI Analyzer</span>
                    <span className="text-xs text-muted-foreground">AI Assistant</span>
                  </div>
                </Link>
              </div>

              {/* Separator */}
              <Separator />

              {/* Navigation Section */}
              <div className="flex-1 px-2 py-3">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleNavItemClick}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          "hover:bg-accent/50",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                          isActive 
                            ? "bg-primary/10 text-primary border border-primary/20 font-semibold" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200",
                          isActive 
                            ? "bg-primary/20 text-primary" 
                            : "text-muted-foreground group-hover:text-accent-foreground"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1">{item.title}</span>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
                
                {/* Theme Toggle - Right below nav items */}
                <div className="mt-6 px-1">
                  <Separator className="mb-4" />
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center min-w-0">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AI Analyzer Logo" width={32} height={32} className="h-8 w-8 invert dark:invert-0" />
            <span className="font-semibold hidden sm:inline-block">AI Analyzer</span>
            <span className="font-semibold sm:hidden">AI Analyzer</span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav 
          ref={navRef}
          className="hidden md:flex items-center space-x-6 lg:space-x-8 absolute left-1/2 transform -translate-x-1/2"
        >
          {/* Animated indicator */}
          <div 
            className="absolute -bottom-1 h-0.5 bg-primary rounded-full transition-all duration-300 ease-in-out"
            style={{
              left: activeIndicator.left,
              width: activeIndicator.width,
            }}
          />
          
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-href={item.href}
              className={cn(
                "text-sm font-normal transition-colors hover:text-primary relative",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle & Sign In Button */}
        <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
          {/* Compact Mobile Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="md:hidden h-9 w-9"
              title={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"} mode`}
            >
              <ThemeIcon className="h-4 w-4" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          
          {/* Desktop Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="flex items-center dark:bg-transparent">
                <span>Sign In</span>
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
