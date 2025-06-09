"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Upload,
  FileText,
  User,
  Bot,
  Paperclip,
  MoreVertical,
  Copy,
  ThumbsUp,
  ThumbsDown,
  // Check, // Removed unused Check icon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; // Import toast
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs"; // ADDED: Clerk components

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  timeString: string;
}

export default function ChatPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI assistant ready to help you analyze your documents. Upload a document and ask me any questions about its content. I can help you understand, summarize, and extract insights from your files.",
      timestamp: new Date(),
      timeString: "",
    },
  ]);

  // Set the initial assistant message's timeString on the client to avoid hydration errors
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 0 && !prev[0].timeString) {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          timeString: new Date(updated[0].timestamp).toLocaleTimeString(),
        };
        return updated;
      }
      return prev;
    });
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [inputValue, setInputValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null
  );
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        type: "assistant",
        content:
          "Hello! I'm your AI assistant ready to help you analyze your documents. Upload a document and ask me any questions about its content. I can help you understand, summarize, and extract insights from your files.",
        timestamp: new Date(),
        timeString: new Date().toLocaleTimeString(), // Ensure timeString is set
      },
    ]);
  };

  const handleExportChat = () => {
    const chatContent = messages
      .map(
        (msg) =>
          `[${msg.timeString}] ${msg.type === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");
    const blob = new Blob([chatContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    let file: File | undefined;
    // Only set the file if a file is explicitly selected
    if (selectedFileIndex !== null && uploadedFiles[selectedFileIndex]) {
      file = uploadedFiles[selectedFileIndex];
    }

    // Add file context to the user message for clarity only if a file is being used
    const fileName = file?.name;
    const now = new Date();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `${inputValue}${fileName ? ` [File: ${fileName}]` : ""}`, // Conditional file name
      timestamp: now,
      timeString: now.toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("question", inputValue);

      const response = await fetch("https://docapi.dmanikanta.site/ask", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // ✅ DEBUG LOG

      const now2 = new Date();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          data.answer || "❌ Sorry, no answer was returned from the backend.",
        timestamp: now2,
        timeString: now2.toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error while calling backend:", err);
      const now3 = new Date();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "assistant",
          content: "❌ Failed to connect to the backend or process the file.",
          timestamp: now3,
          timeString: now3.toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sampleQuestions = [
    "What are the main topics covered in the document?",
    "Can you summarize the key findings?",
    "What methodology was used in the research?",
    "Extract the financial highlights from Q3 report",
    "What are the action items from the meeting notes?",
  ];

  useEffect(() => {
    const container = document.querySelector(".overflow-y-auto");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <SignedIn>
        <div className="container mx-auto py-6 px-4 max-w-7xl min-h-[60vh] pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Upload Section */}
              <Card className="bg-transparent">
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
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;
                      const newFiles = Array.from(files);
                      setUploadedFiles((prev) => [...prev, ...newFiles]);
                    }}
                  />
                  <Button
                    className="w-full"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2 " />
                    Upload Files
                  </Button>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-black dark:text-white uppercase tracking-wide">
                      Uploaded ({uploadedFiles.length})
                    </p>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedFileIndex === index
                            ? "bg-primary/20 border border-primary"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <FileText
                          className="h-4 w-4 text-muted-foreground flex-shrink-0"
                          onClick={() => setSelectedFileIndex(index)}
                        />
                        <div
                          className="flex-1 min-w-0"
                          onClick={() => setSelectedFileIndex(index)}
                        >
                          <p className="text-sm truncate">{file.name}</p>
                        </div>
                        <Badge
                          variant={
                            selectedFileIndex === index ? "default" : "secondary"
                          }
                          className="text-xs"
                          onClick={() => setSelectedFileIndex(index)}
                        >
                          {selectedFileIndex === index ? "Selected" : "Select"}
                        </Badge>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 ml-1"
                          aria-label="Remove file"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            setSelectedFileIndex((prev) => {
                              if (prev === index) return null;
                              if (prev !== null && prev > index) return prev - 1;
                              return prev;
                            });
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <line
                              x1="4"
                              y1="4"
                              x2="14"
                              y2="14"
                              stroke="#ef4444"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                            <line
                              x1="14"
                              y1="4"
                              x2="4"
                              y2="14"
                              stroke="#ef4444"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sample Questions */}
              <Card className="hidden lg:block bg-transparent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-primary">
                    Sample Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors whitespace-normal"
                      onClick={() => setInputValue(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
              <Card className="flex-1 flex flex-col h-full bg-transparent">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Chat with Your Documents
                      </CardTitle>
                      <p className="text-sm text-black dark:text-white mt-1">
                        Ask questions and get AI-powered insights from your uploaded
                        documents
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleClearChat}>Clear Chat</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportChat}>Export Chat</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-6 break-words">
                      {messages.map((message) => (
                        <div key={message.id} className="group">
                          <div
                            className={`flex gap-4 ${
                              message.type === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`flex gap-3 max-w-[85%] ${
                                message.type === "user"
                                  ? "flex-row-reverse"
                                  : "flex-row"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  message.type === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted border"
                                }`}
                              >
                                {message.type === "user" ? (
                                  <User className="h-4 w-4" />
                                ) : (
                                  <Bot className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <div
                                  className={`rounded-2xl px-4 py-3 ${
                                    message.type === "user"
                                      ? "bg-primary text-primary-foreground ml-4"
                                      : "bg-muted mr-4"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {message.content}
                                  </p>
                                </div>
                                <div
                                  className={`flex items-center gap-2 text-xs text-muted-foreground ${
                                    message.type === "user"
                                      ? "justify-end mr-4"
                                      : "justify-start ml-4"
                                  }`}
                                >
                                  <span>{message.timeString}</span>
                                  {message.type === "assistant" && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={async () => {
                                          const textToCopy = message.content;
                                          if (navigator.clipboard && navigator.clipboard.writeText) {
                                            try {
                                              await navigator.clipboard.writeText(textToCopy);
                                              toast.success("Message copied to clipboard!");
                                            } catch (err) {
                                              console.error("Failed to copy using Clipboard API: ", err);
                                              let errorMessage = "Could not copy message.";
                                              if (err instanceof Error && err.name === 'NotAllowedError') {
                                                errorMessage = "Clipboard permission denied.";
                                              }
                                              toast.error(errorMessage);
                                            }
                                          } else {
                                            // Fallback for browsers/contexts where Clipboard API is not available (e.g., HTTP)
                                            try {
                                              const textArea = document.createElement("textarea");
                                              textArea.value = textToCopy;
                                              textArea.style.position = "fixed"; // Prevent scrolling to bottom
                                              textArea.style.opacity = "0"; // Hide the textarea
                                              document.body.appendChild(textArea);
                                              textArea.focus();
                                              textArea.select();
                                              const successful = document.execCommand("copy");
                                              document.body.removeChild(textArea);
                                              if (successful) {
                                                toast.success("Message copied (fallback)!");
                                              } else {
                                                toast.error("Copying not supported or failed.");
                                                if (window.isSecureContext === false) {
                                                  console.warn("Clipboard API requires HTTPS. Fallback also failed.");
                                                  toast.info("For clipboard access, please use HTTPS.");
                                                } else {
                                                  console.warn("Clipboard API not available and fallback failed.");
                                                }
                                              }
                                            } catch (err) {
                                              console.error("Fallback copy method failed: ", err);
                                              toast.error("Copying failed.");
                                            }
                                          }
                                        }}
                                        aria-label="Copy message"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                      >
                                        <ThumbsUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                      >
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
                  </div>

                  {/* Sample Questions for Mobile */}
                  <div className="lg:hidden p-4 border-t bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Quick questions:
                    </p>
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
                  <div className="border-t p-4 bg-background">
                    <div className="relative">
                      <Textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Ask about ${selectedFileIndex !== null ? uploadedFiles[selectedFileIndex]?.name : 'your documents'}...`}
                        className="w-full pr-16 resize-none min-h-[48px] max-h-[200px] py-3 pl-4 text-base md:text-sm" // MODIFIED: text-sm to text-base md:text-sm
                        rows={1} // Start with 1 row, will auto-expand
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full"
                        onClick={handleSendMessage}
                        disabled={isTyping || !inputValue.trim()}
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </div>
                    {isTyping && (
                      <p className="text-xs text-muted-foreground mt-2 ml-1">
                        AI is typing...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
    </>
  );
}
