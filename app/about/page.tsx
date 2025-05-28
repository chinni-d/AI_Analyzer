import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, Database, Search, Zap, Shield, Globe, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-6xl">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Document QA Generator</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn about our RAG-powered document analysis system and the technology behind intelligent document
            processing
          </p>
        </div>

        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Brain className="h-6 w-6" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed text-lg">
              The Document QA Generator is an advanced AI-powered application that enables users to upload documents and
              ask natural language questions about their content. Built using cutting-edge Retrieval-Augmented
              Generation (RAG) architecture, it combines the power of information retrieval with large language models
              to provide accurate, contextual answers.
            </p>
            <div className="flex flex-wrap gap-2">
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
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Vector Search
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Semantic Understanding
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* RAG Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Database className="h-6 w-6" />
              RAG Architecture
            </CardTitle>
            <CardDescription className="text-base">
              Retrieval-Augmented Generation combines retrieval and generation for accurate responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">1. Retrieval</h3>
                <p className="text-muted-foreground">
                  Relevant document chunks are retrieved based on semantic similarity to the user's question using
                  advanced vector search.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">2. Augmentation</h3>
                <p className="text-muted-foreground">
                  Retrieved context is combined with the user's question to create an enhanced prompt with relevant
                  information.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">3. Generation</h3>
                <p className="text-muted-foreground">
                  A large language model generates accurate, contextual answers based on the augmented prompt and
                  retrieved content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Technology Stack</CardTitle>
            <CardDescription className="text-base">
              Built with modern technologies for optimal performance and scalability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-xl space-y-4">
                <h4 className="text-lg font-semibold">Frontend</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
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

              <div className="p-6 border rounded-xl space-y-4">
                <h4 className="text-lg font-semibold">AI & Machine Learning</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>OpenAI GPT-4 Turbo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Vector Embeddings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Semantic Search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>RAG Pipeline</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-xl space-y-4">
                <h4 className="text-lg font-semibold">Backend & Infrastructure</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Node.js Runtime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Pinecone Vector DB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Document Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Vercel Deployment</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-medium">Accurate Responses</h4>
                    <p className="text-muted-foreground">
                      RAG ensures answers are grounded in your actual document content, reducing hallucinations and
                      improving accuracy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Globe className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-medium">Multi-format Support</h4>
                    <p className="text-muted-foreground">
                      Works with PDF, Word documents, text files, and more with intelligent content extraction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Zap className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-medium">Fast Processing</h4>
                    <p className="text-muted-foreground">
                      Optimized vector search and caching for quick document retrieval and response generation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Brain className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-medium">Natural Language</h4>
                    <p className="text-muted-foreground">
                      Ask questions in plain English with context understanding and conversational follow-ups.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Meet the Developer</CardTitle>
            <CardDescription className="text-base">The team behind Document QA Generator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <Avatar className="w-32 h-32">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Developer" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold">John Developer</h3>
                  <p className="text-lg text-muted-foreground">Full Stack AI Engineer</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Passionate about building AI-powered applications that solve real-world problems. With expertise in
                  machine learning, web development, and user experience design, I focus on creating intuitive tools
                  that make complex AI technology accessible to everyone.
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="h-6 w-6" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Linkedin className="h-6 w-6" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="h-6 w-6" />
                    <span className="sr-only">Email</span>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Use Cases & Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Research & Academia</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Analyze research papers and publications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Extract key findings and methodologies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Compare multiple documents and studies</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Business & Legal</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Review contracts and agreements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Analyze financial reports and statements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Extract compliance and regulatory information</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Education & Learning</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Study textbooks and educational materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Get explanations of complex topics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Create personalized study guides</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Personal & Professional</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Organize and search personal documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Extract information from manuals and guides</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Analyze reports and technical documentation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
