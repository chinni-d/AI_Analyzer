"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Upload, MessageSquare, Brain } from "lucide-react"
import Link from "next/link"
import { MorphingText } from "@/components/liquid-text"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      {children}
    </motion.div>
  )
}

function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        ...cardVariants,
        visible: {
          ...cardVariants.visible,
          transition: { ...cardVariants.visible.transition, delay },
        },
      }}
    >
      {children}
    </motion.div>
  )
}


export default function HomePage() {
  // Set dynamic page title
  useEffect(() => {
    document.title = "AI Analyzer | Home"
  }, [])

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto">
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <AnimatedSection>
            <div className="text-center space-y-4 mt-12 opacity-70">
              <MorphingText texts={["Welcome", "to", "AI", "Analyzer"]} />
              <h1 className="text-xl md:text-xl lg:text-xl font-bold tracking-tight">
             Get Answers from Your Documents and URLs Instantly
              </h1>
              <p className="text-base md:text-base max-w-base mx-auto text-black/80 dark:text-white/80">
              Upload your documents or provide URLs and get instant, accurate answers using advanced Retrieval-Augmented Generation
                (RAG) technology.
              </p>
              <div className="flex flex-row gap-3 sm:gap-4 justify-center mt-8">
              <Button asChild size="lg" className="text-sm sm:text-base w-36 sm:w-auto">
                <Link href="/chat">
                Start Chatting
                <motion.div
                  className="ml-2 inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-sm sm:text-base w-32 sm:w-auto bg-transparent hover:bg-transparent">
                <Link href="/about">
                Learn More
                </Link>
              </Button>
              </div>
            </div>
          </AnimatedSection>

          {/* Features Grid */}
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <AnimatedCard delay={0}>
                <Card className="text-center bg-transparent shadow-none h-full">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="opacity-80">Upload Source </CardTitle>
                    <CardDescription className="text-black/50 dark:text-white/40">
                      Supports adding website URLs, PDF, Word, and text files for analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-black/40 dark:text-white/40">
                    Upload documents or URLs for instant AI analysis.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={0.2}>
                <Card className="text-center bg-transparent shadow-none h-full">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="opacity-80">Ask Questions</CardTitle>
                    <CardDescription className="text-black/50 dark:text-white/40">Natural language queries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-black/40 dark:text-white/40">
                      Ask questions in plain English and get precise answers from your documents.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={0.4}>
                <Card className="text-center bg-transparent shadow-none h-full">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="opacity-80">AI-Powered</CardTitle>
                    <CardDescription className="text-black/50 dark:text-white/40">Advanced RAG technology</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-black/40 dark:text-white/40">
                      Powered by state-of-the-art retrieval and generation models for accurate responses.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
