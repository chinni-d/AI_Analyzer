"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image";
import { usePathname } from "next/navigation"
import { Menu, X, HomeIcon, MessageSquare, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
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
          <SheetContent 
            side="left" 
            className="w-3/5 p-4 md:w-[250px] bg-white dark:bg-[#161616]"
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
            <div className="flex flex-col h-full"> {/* Changed space-y-4 to flex-col h-full for manual spacing control */}
              <div className="flex items-center justify-between"> {/* Removed mb-2, separator will handle spacing */}
                <Link href="/" className="flex items-center gap-2" onClick={handleNavItemClick}>
                  <Image src="/logo.png" alt="Document Analyzer Logo" width={24} height={24} className="h-6 w-6 invert dark:invert-0" />
                  <span className="font-semibold text-md">Doc Analyzer</span>
                </Link>
              </div>

              <Separator className="my-3" />

              <nav className="flex flex-col space-y-1.5 flex-grow"> {/* Kept space-y at 1.5 */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavItemClick}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background", // Adjusted padding, gap, text size back to sm
                        pathname === item.href 
                          ? "bg-accent text-primary font-semibold shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className={cn(
                        "h-[18px] w-[18px] transition-colors duration-150 ease-in-out", // Slightly increased icon size to 18px
                        pathname === item.href
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-accent-foreground"
                      )} />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
              {/* Optionally, add a ThemeToggle or other footer items here if desired for mobile sidebar */}
              {/* For example, a fixed ThemeToggle at the bottom: */}
              {/* <div className="mt-auto"> <ThemeToggle /> </div> */}
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

        {/* Theme Toggle & Sign In Button */}
        <div className="flex items-center flex-1 justify-end space-x-4"> {/* MODIFIED: Added space-x-4 for spacing */}
          <ThemeToggle /> {/* MOVED: ThemeToggle now comes first */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="flex items-center dark:bg-transparent">
                <span>Sign In</span> {/* Text only, removed responsive classes for icon */}
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
