"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Send, Upload, FileText, User, Bot, Paperclip, MoreVertical, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI assistant ready to help you analyze your documents. Upload a document and ask me any questions about its content. I can help you understand, summarize, and extract insights from your files.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Based on your uploaded documents, I can provide insights about "${inputValue}". This is a simulated response demonstrating how the RAG system would analyze your documents and provide contextual answers. In a real implementation, I would search through your document embeddings, retrieve relevant passages, and generate accurate responses based on the actual content.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const sampleQuestions = [
    "What are the main topics covered in the documents?",
    "Can you summarize the key findings?",
    "What methodology was used in the research?",
    "Extract the financial highlights from Q3 report",
    "What are the action items from the meeting notes?",
  ]

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl min-h-[60vh] pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Upload Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={e => {
                  const files = e.target.files;
                  if (!files) return;
                  const fileNames = Array.from(files).map(f => f.name);
                  setUploadedFiles(prev => [...prev, ...fileNames]);
                }}
              />
              <Button
                className="w-full"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Uploaded ({uploadedFiles.length})
                </p>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{file}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Ready
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sample Questions */}
          <Card className="hidden lg:block">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Sample Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sampleQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2 text-xs"
                  onClick={() => setInputValue(question)}
                >
                  <span className="line-clamp-2">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Chat with Your Documents</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask questions and get AI-powered insights from your uploaded documents
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                    <DropdownMenuItem>Export Chat</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div key={message.id} className="group">
                      <div className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex gap-3 max-w-[85%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted border"
                            }`}
                          >
                            {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                message.type === "user" ? "bg-primary text-primary-foreground ml-4" : "bg-muted mr-4"
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <div
                              className={`flex items-center gap-2 text-xs text-muted-foreground ${
                                message.type === "user" ? "justify-end mr-4" : "justify-start ml-4"
                              }`}
                            >
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                              {message.type === "assistant" && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted border">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Sample Questions for Mobile */}
              <div className="lg:hidden p-4 border-t bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground mb-2">Quick questions:</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {sampleQuestions.slice(0, 3).map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs whitespace-nowrap flex-shrink-0"
                      onClick={() => setInputValue(question)}
                    >
                      {question.split(" ").slice(0, 4).join(" ")}...
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Ask a question about your documents..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[44px] max-h-32 resize-none pr-12"
                      rows={1}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                    className="h-11 w-11"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
