"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "system", icon: Monitor, label: "System" },
  ]

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      {themes.map(({ name, icon: Icon, label }) => (
        <Button
          key={name}
          variant="ghost"
          size="sm"
          onClick={() => setTheme(name)}
          className={cn(
            "h-8 w-8 p-0 transition-all",
            theme === name ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  )
}
