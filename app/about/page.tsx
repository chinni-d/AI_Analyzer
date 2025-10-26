"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Database,
  Search,
  Zap,
  Shield,
  Globe,
  Github,
  Linkedin,
  Mail,
  Globe2,
} from "lucide-react";
import Link from "next/link";
import { SparklesText } from "@/components/sparkles-text";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function AboutPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="container mx-auto py-8 px-4 md:px-6 max-w-6xl"
    >
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl  tracking-tight">
            <SparklesText sparklesCount={30} text="About AI Analyzer" />
          </h1>
          <p className="text-base text-black/40 dark:text-white/40 max-w-3xl mx-auto">
            Learn about our RAG-powered document analysis system and the
            technology behind intelligent document processing
          </p>
        </div>

        {/* Project Overview */}
        <div className="block-container">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl opacity-80">
                  <Brain className="h-6 w-6" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-black/40 dark:text-white/40 leading-relaxed text-sm lg:text-base">
                  The AI Analyzer is an advanced AI-powered application that
                  enables users to upload documents or provide a URL and ask
                  natural language questions about their content. Built using
                  cutting-edge Retrieval-Augmented Generation (RAG)
                  architecture, it combines the power of information retrieval
                  with large language models to provide accurate, contextual
                  answers.
                </p>
                <div className="flex flex-wrap gap-2 opacity-80 justify-center md:justify-start">
                  <Badge variant="secondary" className="text-sm">
                    RAG Architecture
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Natural Language Processing
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Document Analysis
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    URL Analysis
                  </Badge>

                  <Badge variant="secondary" className="text-sm">
                    Semantic Understanding
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Semantic Search
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* RAG Architecture */}
        <div className="block-container">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl opacity-80">
                  <Database className="h-6 w-6 " />
                  RAG Architecture
                </CardTitle>
                <CardDescription className="text-base text-black/40 dark:text-white/40">
                  Retrieval-Augmented Generation combines retrieval and
                  generation for accurate responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto">
                      <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-black/50 dark:text-white/40">
                      1. Retrieval
                    </h3>
                    <p className="text-black/40 dark:text-white/40 text-sm lg:text-base">
                      Relevant document chunks are retrieved based on semantic
                      similarity to the user's question using advanced semantic
                      search.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto">
                      <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-black/50 dark:text-white/40">
                      2. Augmentation
                    </h3>
                    <p className="text-black/40 dark:text-white/40 text-sm lg:text-base">
                      Retrieved context is combined with the user's question to
                      create an enhanced prompt with relevant information.
                    </p>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto">
                      <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-black/50 dark:text-white/40">
                      3. Generation
                    </h3>
                    <p className="text-black/40 dark:text-white/40 text-sm lg:text-base">
                      A large language model generates accurate, contextual
                      answers based on the augmented prompt and retrieved
                      content.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Technical Stack */}
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-2xl opacity-80">
              Technology Stack
            </CardTitle>
            <CardDescription className="text-base text-black/40 dark:text-white/40">
              Built with modern technologies for optimal performance and
              scalability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="block-container">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <div className="p-6 border rounded-xl space-y-4 h-full">
                    <h4 className="text-lg font-semibold text-black/50 dark:text-white/40">
                      Frontend
                    </h4>
                    <div className="space-y-2 text-sm text-black/40 dark:text-white/40">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Next.js 14 (App Router)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span>React 18 with TypeScript</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Tailwind CSS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <span>shadcn/ui Components</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="block-container">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <div className="p-6 border rounded-xl space-y-4 h-full">
                    <h4 className="text-lg font-semibold text-black/50 dark:text-white/40">
                      AI & Machine Learning
                    </h4>
                    <div className="space-y-2 text-sm text-black/40 dark:text-white/40">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>AI/LLM (OpenAI gpt-4o-mini)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>
                          Vector Embeddings <br />
                          (HuggingFace all-MiniLM-L6-v2)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Semantic Search (FAISS)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>RAG Pipeline (LangChain + RetrievalQA)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="block-container">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <div className="p-6 border rounded-xl space-y-4 h-full">
                    <h4 className="text-lg font-semibold text-black/50 dark:text-white/40">
                      Backend & Infrastructure
                    </h4>
                    <div className="space-y-2 text-sm text-black/40 dark:text-white/40">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Python via Uvicorn</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>FAISS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Document Processing </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span>FAST API</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                        <span>Web Scraping (Beautiful Soup)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="block-container">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl opacity-80">
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-medium text-black/50 dark:text-white/40">
                          Accurate Responses
                        </h4>
                        <p className="text-black/40 dark:text-white/40 text-base lg:text-base">
                          RAG ensures answers are grounded in your actual
                          document content, reducing hallucinations and
                          improving accuracy.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Globe className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-medium text-black/50 dark:text-white/40">
                          Multi-format Support
                        </h4>
                        <p className="text-black/40 dark:text-white/40 text-base lg:text-base">
                          Works with PDF, Word documents, text files, and live
                          webpages with intelligent content extraction.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-black/50 dark:text-white/40">
                        Fast Processing
                      </h4>
                      <p className="text-black/40 dark:text-white/40 text-sm lg:text-base">
                        Optimized semantic search and caching for quick document
                        retrieval and response generation.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-black/50 dark:text-white/40">
                        Natural Language
                      </h4>
                      <p className="text-black/40 dark:text-white/40 text-sm lg:text-base">
                        Ask questions in plain English with context
                        understanding and conversational follow-ups.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Developer Section */}
        <div className="block-container">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl opacity-80">
                  Meet the Developer
                </CardTitle>
                <CardDescription className="text-base text-black/40 dark:text-white/40">
                  The creator behind this AI Analyzer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="img1.png" alt="Developer" />
                    <AvatarFallback className="text-2xl">MD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-black/60 dark:text-white/60 md:[font-family:'Segoe_Script','Brush_Script_MT',cursive]">
                        Manikanta Darapureddy
                      </h3>
                    </div>
                    <p className="text-black/40 dark:text-white/40 leading-relaxed text-sm lg:text-base">
                      Passionate about building AI-powered applications that
                      solve real-world problems. With expertise in machine
                      learning, web development, and user experience design, I
                      focus on creating intuitive tools that make complex AI
                      technology accessible to everyone.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                      <Link
                        href="https://github.com/chinni-d"
                        target="_blank"
                        className="text-black/40 dark:text-white/40 hover:text-foreground transition-colors"
                      >
                        <Github className="h-6 w-6" />
                        <span className="sr-only">GitHub</span>
                      </Link>
                      <Link
                        href="https://www.linkedin.com/in/manikanta-darapureddy-6a1125314/"
                        target="_blank"
                        className="text-black/40 dark:text-white/40 hover:text-foreground transition-colors"
                      >
                        <Linkedin className="h-6 w-6" />
                        <span className="sr-only">LinkedIn</span>
                      </Link>
                      <Link
                        href="mailto:darapureddymanikanta8@gmail.com"
                        target="_blank"
                        className="text-black/40 dark:text-white/40 hover:text-foreground transition-colors"
                      >
                        <Mail className="h-6 w-6" />
                        <span className="sr-only">Email</span>
                      </Link>
                      <Link
                        href="https://www.dmanikanta.site/"
                        target="_blank"
                        className="text-black/40 dark:text-white/40 hover:text-foreground transition-colors"
                      >
                        <Globe2 className="h-6 w-6" />
                        <span className="sr-only">Website</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Have Questions Section */}
        <div className="block-container">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Have any questions?
                </CardTitle>
                <CardDescription className="text-base text-black/40 dark:text-white/40 text-center">
                  Start a conversation with our AI Analyzer for more help.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/chat">
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-black dark:bg-white text-white dark:text-black border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black dark:hover:border-white px-6 py-2 text-sm rounded-lg shadow-md"
                    >
                      Chat Now
                    </Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
