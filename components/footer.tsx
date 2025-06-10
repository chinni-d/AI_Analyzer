import Link from "next/link"
import { FileText, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-6 border-t border-muted-foreground/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <p className="text-sm text-black dark:text-white">© {new Date().getFullYear()} Document Analyzer. All rights reserved.</p>
        <p className="text-sm text-black dark:text-white">Built with 💛 using Next.js and AI technology</p>
      </div>
    </footer>
  )
}
