"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Upload,
  Link,
  MoreVertical,
  Send,
  Trash2,
  Download,
  Loader2,
  CheckCircle,
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";
import { SignedIn, SignedOut, SignIn, useUser } from "@clerk/nextjs";
import { Tiles } from "@/components/tiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// Add mammoth for DOCX processing
declare global {
  interface Window {
    mammoth: any;
  }
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  timeString: string;
}

export default function ChatPage() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Keep this for marking the end
  const scrollAreaRef = useRef<React.ElementRef<typeof ScrollArea>>(null); // Ensure scrollAreaRef is defined
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const docInitialMessage =
    "Hello! I'm your AI assistant ready to help you analyze your documents. Upload a document and ask me any questions about its content. I can help you understand, summarize, and extract insights from your files.";
  const urlInitialMessage =
    "Hello! I'm your AI assistant for web content. Paste a URL to extract its content, and then ask me any questions to get a summary or specific insights.";

  // Function to extract text content from different file types
  const extractTextFromFile = async (file: File): Promise<string | null> => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    try {
      switch (fileExtension) {
        case ".txt":
          // Read text file directly
          return await file.text();

        case ".docx":
          // Read DOCX file using mammoth.js
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
              try {
                // Load mammoth.js dynamically if not already loaded
                if (!window.mammoth) {
                  const script = document.createElement("script");
                  script.src =
                    "https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js";
                  script.onload = async () => {
                    try {
                      const result = await window.mammoth.extractRawText({
                        arrayBuffer: e.target?.result,
                      });
                      resolve(result.value || "");
                    } catch (error) {
                      console.error("Mammoth extraction error:", error);
                      reject(error);
                    }
                  };
                  script.onerror = () =>
                    reject(new Error("Failed to load mammoth.js"));
                  document.head.appendChild(script);
                } else {
                  const result = await window.mammoth.extractRawText({
                    arrayBuffer: e.target?.result,
                  });
                  resolve(result.value || "");
                }
              } catch (error) {
                console.error("DOCX processing error:", error);
                reject(error);
              }
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsArrayBuffer(file);
          });

        case ".pdf":
          // For PDF, we'll still rely on backend processing for now
          // Could add PDF.js here in the future
          return null;

        default:
          return null;
      }
    } catch (error) {
      console.error(`Error extracting text from ${fileExtension} file:`, error);
      return null;
    }
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: docInitialMessage,
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
  const [urlInput, setUrlInput] = useState("");
  const [urlContent, setUrlContent] = useState<string | null>(null);
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("files");
  const [loadedUrl, setLoadedUrl] = useState<string>("");

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        type: "assistant",
        content: activeTab === "url" ? urlInitialMessage : docInitialMessage,
        timestamp: new Date(),
        timeString: new Date().toLocaleTimeString(), // Ensure timeString is set
      },
    ]);
    setUploadedFiles([]);
    setSelectedFileIndex(null);
    setUrlContent(null);
    setUrlInput("");
    setInputValue("");
    setLoadedUrl("");
  };

  const handleExportChat = () => {
    const chatContent = messages
      .map(
        (msg) =>
          `[${msg.timeString}] ${msg.type === "user" ? "User" : "Assistant"}: ${
            msg.content
          }`
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

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;

    const urlToFetch = urlInput;
    setUrlInput("");
    setIsUrlLoading(true);
    setIsTyping(true);
    setLoadedUrl("");

    const now = new Date();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Analyze URL: ${urlToFetch}`,
      timestamp: now,
      timeString: now.toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        "https://webscrap-backend-iota.vercel.app/api/extract-url",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlToFetch }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText || "Failed to fetch URL"}`
        );
      }

      const data = await response.json();
      let summary = "Could not extract a summary.";
      let content = "";

      if (data.content) {
        content = data.content;
        summary =
          data.summary ||
          content.split("\n").slice(0, 5).join("\n") +
            (content.split("\n").length > 5 ? "..." : "");
        if (!summary.trim()) {
          summary =
            "Content extracted, but summary is empty. Ask me questions to learn more.";
        }
      } else if (data.summary) {
        summary = data.summary;
        content = data.summary;
      } else if (data.error) {
        throw new Error(data.error);
      }

      if (selectedFileIndex !== null) {
        toast.info("Switched context to URL content.");
      }
      setUrlContent(content);
      setSelectedFileIndex(null);
      setLoadedUrl(urlToFetch);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Successfully extracted content from **${urlToFetch}**.\n\n**Summary:**\n${summary}\n\nYou can now ask me questions about this content.`,
        timestamp: new Date(),
        timeString: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `❌ Error analyzing URL: ${errorMessage}`,
        timestamp: new Date(),
        timeString: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setUrlContent(null);
    } finally {
      setIsUrlLoading(false);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    let file: File | undefined;
    let extractedText: string | null = null;

    // Only set the file if a file is explicitly selected
    if (selectedFileIndex !== null && uploadedFiles[selectedFileIndex]) {
      file = uploadedFiles[selectedFileIndex];

      // Validate file type
      const validTypes = [".pdf", ".docx", ".txt"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!validTypes.includes(fileExtension)) {
        toast.error(
          `File type ${fileExtension} is not supported. Please upload PDF, DOCX, or TXT files.`
        );
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB.");
        return;
      }

      // Extract text content for TXT and DOCX files
      if (fileExtension === ".txt" || fileExtension === ".docx") {
        try {
          toast.loading(`Reading ${fileExtension.toUpperCase()} file...`);
          extractedText = await extractTextFromFile(file);
          toast.dismiss();

          if (extractedText && extractedText.trim()) {
            console.log(
              `Successfully extracted ${extractedText.length} characters from ${file.name}`
            );
          } else {
            toast.error(
              `Could not extract text from ${file.name}. The file may be empty or corrupted.`
            );
            return;
          }
        } catch (error) {
          toast.dismiss();
          toast.error(
            `Failed to read ${file.name}. Please try a different file or format.`
          );
          console.error("Text extraction error:", error);
          return;
        }
      }
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

      if (urlContent) {
        const enhancedQuestion = `${inputValue}\n\nDocument: From URL\nContent:\n${urlContent}`;
        formData.append("question", enhancedQuestion);
        formData.append("document_name", "Pasted URL Content");
        formData.append("has_document_content", "true");
        console.log(
          `Sending question with URL content (${urlContent.length} characters)`
        );
      } else if (file) {
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

        if (
          extractedText &&
          (fileExtension === ".txt" || fileExtension === ".docx")
        ) {
          // For TXT and DOCX files with extracted text, send the text content directly
          const enhancedQuestion = `${inputValue}

Document: ${file.name}
Content:
${extractedText}`;

          formData.append("question", enhancedQuestion);
          formData.append("document_name", file.name);
          formData.append("document_type", fileExtension.substring(1));
          formData.append("has_document_content", "true");

          console.log(
            `Sending extracted text from ${file.name} (${extractedText.length} characters)`
          );
        } else if (fileExtension === ".pdf") {
          // For PDF files, send the file to backend for processing
          formData.append("file", file);
          formData.append("question", inputValue);
          formData.append("file_type", "pdf");
          formData.append("file_name", file.name);
          formData.append("file_size", file.size.toString());

          console.log(`Sending PDF file: ${file.name} (${file.size} bytes)`);
        } else {
          // Fallback for other cases
          formData.append("file", file);
          formData.append("question", inputValue);
          formData.append("file_type", fileExtension.substring(1));
          formData.append("file_name", file.name);
        }
      } else {
        // No file, just send question
        formData.append("question", inputValue);
      }

      const response = await fetch(
        "https://ai-analyzer-backend.vercel.app/api/ask",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText || response.statusText}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Handle response
      let assistantContent = "";
      if (data.answer && data.answer.trim()) {
        assistantContent = data.answer;
      } else if (data.error) {
        if (extractedText && file) {
          // If we have extracted text but still got an error, the issue might be with the backend
          assistantContent = `❌ Backend processing error: ${data.error}

However, I was able to read your ${file.name} file successfully. The document contains ${extractedText.length} characters of text.

**Alternative**: You can ask me questions about the content directly by copying and pasting the text, or try uploading the document as a PDF format.`;
        } else {
          assistantContent = `❌ Error: ${data.error}`;
        }
      } else if (data.message && data.message.trim()) {
        assistantContent = data.message;
      } else {
        if (extractedText && file) {
          assistantContent = `✅ Successfully read ${file.name} (${extractedText.length} characters)

The backend didn't return a specific response, but I have access to your document content. You can now ask me specific questions about the document, and I'll be able to help analyze the content.

Try asking questions like:
• "What are the main topics in this document?"
• "Can you summarize the key points?"
• "What are the important details?"`;
        } else {
          assistantContent =
            "❌ No response received from the service. Please try again.";
        }
      }

      const now2 = new Date();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: assistantContent,
        timestamp: now2,
        timeString: now2.toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error while calling backend:", err);
      const now3 = new Date();
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "assistant",
          content: `❌ Failed to connect to the backend: ${errorMessage}. Please check your internet connection and try again.`,
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

  const docSampleQuestions = [
    "What are the main topics covered in the document?",
    "Can you summarize the key findings?",
    "What methodology was used in the research?",
    "What are the action items from the meeting notes?",
  ];

  const urlSampleQuestions = [
    "What is the main topic of this webpage?",
    "Summarize the key points from this URL.",
    "What are the key technologies or products mentioned?",
    "Extract the main conclusions or arguments.",
  ];

  const sampleQuestions =
    activeTab === "url" ? urlSampleQuestions : docSampleQuestions;

  useEffect(() => {
    const element = messagesEndRef.current;
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "auto", block: "nearest" });
      }, 150); // Increased timeout slightly for reliability
    }
  }, [messages]);

  return (
    <>
      {/* Grid Background - Fixed positioning */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Tiles />
      </div>

      <SignedIn>
        <div className="container mx-auto py-6 px-4 max-w-7xl min-h-[60vh] pb-40 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Tabs
                defaultValue="files"
                className="w-full"
                onValueChange={(value) => {
                  setActiveTab(value);
                  // If the chat is in its initial state, update the welcome message
                  if (messages.length === 1 && messages[0].id === "1") {
                    setMessages([
                      {
                        ...messages[0],
                        content:
                          value === "url"
                            ? urlInitialMessage
                            : docInitialMessage,
                      },
                    ]);
                  }
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="files">
                    <FileText className="h-4 w-4 mr-2" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <Link className="h-4 w-4 mr-2" />
                    URL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="files">
                  <Card className="bg-transparent">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents
                      </CardTitle>
                      <div className="text-xs text-muted-foreground mt-1">
                        Supported: PDF, DOCX, TXT files
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
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
                              onClick={() => {
                                setSelectedFileIndex(index);
                                if (urlContent) setUrlContent(null);
                              }}
                            />
                            <div
                              className="flex-1 min-w-0"
                              onClick={() => {
                                setSelectedFileIndex(index);
                                if (urlContent) setUrlContent(null);
                              }}
                            >
                              <p className="text-sm truncate">{file.name}</p>
                            </div>
                            <Badge
                              variant={
                                selectedFileIndex === index
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                              onClick={() => {
                                setSelectedFileIndex(index);
                                if (urlContent) setUrlContent(null);
                              }}
                            >
                              {selectedFileIndex === index
                                ? "Selected"
                                : "Select"}
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
                                  if (prev !== null && prev > index)
                                    return prev - 1;
                                  return prev;
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="url">
                  <Card className="bg-transparent">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Paste URL here</CardTitle>
                      <div className="text-xs text-muted-foreground mt-1">
                        Extract content from a webpage for analysis.
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="url-input">Webpage URL</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="url-input"
                            type="url"
                            placeholder="https://example.com"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            disabled={isUrlLoading || isTyping}
                          />
                          <Button
                            onClick={handleUrlSubmit}
                            disabled={
                              isUrlLoading || isTyping || !urlInput.trim()
                            }
                            className="w-[90px]"
                          >
                            {isUrlLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Extract"
                            )}
                          </Button>
                        </div>
                      </div>
                      {loadedUrl && urlContent && (
                        <div className="p-3 bg-muted/50 rounded-lg border border-green-600/30 text-sm space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="flex items-center font-medium text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                              URL Context Loaded
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                setUrlContent(null);
                                setLoadedUrl("");
                                toast.info(
                                  "URL context cleared. You can now chat normally."
                                );
                              }}
                              aria-label="Clear URL context"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          <a
                            href={loadedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-muted-foreground hover:underline truncate"
                          >
                            {loadedUrl}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

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
                {/* MODIFIED: Adjusted padding for CardHeader, title and description text sizes for mobile */}
                <CardHeader className="border-b px-4 py-3 md:px-6 md:py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg md:text-xl">
                        {activeTab === "url"
                          ? "Chat with URL"
                          : "Chat with Your Documents"}
                      </CardTitle>
                      <p className="text-xs md:text-sm text-black dark:text-white mt-1">
                        {activeTab === "url"
                          ? "Ask questions and get AI-powered insights from a URL."
                          : "Ask questions and get AI-powered insights from your uploaded documents"}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleClearChat}>
                          Clear Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportChat}>
                          Export Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  <ScrollArea
                    ref={scrollAreaRef}
                    className="flex-1" // MODIFIED: Removed p-4 from here
                    scrollbarClassName="lg:hidden"
                  >
                    {/* MODIFIED: Added p-4 to this inner div */}
                    <div className="p-4 space-y-4 md:space-y-6 break-words">
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
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                                  // ADDED: overflow-hidden
                                  message.type === "user"
                                    ? user?.imageUrl
                                      ? "bg-transparent"
                                      : "bg-primary text-primary-foreground" // MODIFIED: Conditional background, corrected property to imageUrl
                                    : "bg-muted border"
                                }`}
                              >
                                {message.type === "user" ? (
                                  user?.imageUrl ? (
                                    <img
                                      src={user.imageUrl} // MODIFIED: Corrected property to imageUrl
                                      alt={user.fullName || "User avatar"}
                                      className="w-full h-full object-cover" // Image fills the div, styled to cover
                                    />
                                  ) : (
                                    <User className="h-5 w-5" /> // Fallback icon
                                  )
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
                                    // MODIFIED: Message actions always visible on mobile, hover on desktop
                                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={async () => {
                                          const textToCopy = message.content;
                                          if (
                                            navigator.clipboard &&
                                            navigator.clipboard.writeText
                                          ) {
                                            try {
                                              await navigator.clipboard.writeText(
                                                textToCopy
                                              );
                                              toast.success(
                                                "Message copied to clipboard!"
                                              );
                                            } catch (err) {
                                              console.error(
                                                "Failed to copy using Clipboard API: ",
                                                err
                                              );
                                              let errorMessage =
                                                "Could not copy message.";
                                              if (
                                                err instanceof Error &&
                                                err.name === "NotAllowedError"
                                              ) {
                                                errorMessage =
                                                  "Clipboard permission denied.";
                                              }
                                              toast.error(errorMessage);
                                            }
                                          } else {
                                            // Fallback for browsers/contexts where Clipboard API is not available (e.g., HTTP)
                                            try {
                                              const textArea =
                                                document.createElement(
                                                  "textarea"
                                                );
                                              textArea.value = textToCopy;
                                              textArea.style.position = "fixed"; // Prevent scrolling to bottom
                                              textArea.style.opacity = "0"; // Hide the textarea
                                              document.body.appendChild(
                                                textArea
                                              );
                                              textArea.focus();
                                              textArea.select();
                                              const successful =
                                                document.execCommand("copy");
                                              document.body.removeChild(
                                                textArea
                                              );
                                              if (successful) {
                                                toast.success(
                                                  "Message copied (fallback)!"
                                                );
                                              } else {
                                                toast.error(
                                                  "Copying not supported or failed."
                                                );
                                                if (
                                                  window.isSecureContext ===
                                                  false
                                                ) {
                                                  console.warn(
                                                    "Clipboard API requires HTTPS. Fallback also failed."
                                                  );
                                                  toast.info(
                                                    "For clipboard access, please use HTTPS."
                                                  );
                                                } else {
                                                  console.warn(
                                                    "Clipboard API not available and fallback failed."
                                                  );
                                                }
                                              }
                                            } catch (err) {
                                              console.error(
                                                "Fallback copy method failed: ",
                                                err
                                              );
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
                  </ScrollArea>

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
                        placeholder={
                          urlContent
                            ? "Ask about the URL content..."
                            : selectedFileIndex !== null
                            ? `Ask about ${uploadedFiles[selectedFileIndex]?.name}...`
                            : activeTab === "url"
                            ? "Extract URL or ask a question."
                            : "Select a file or ask a question."
                        }
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
