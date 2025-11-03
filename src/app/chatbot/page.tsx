"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Send, Bot, User, Loader2, Database, Wrench } from "lucide-react"
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/app-sidebar"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Capabilities {
  resources: Array<{ name: string; description: string }>
  tools: Array<{ name: string; description: string }>
  prompts: Array<{ name: string; description: string }>
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationHistoryRef = useRef<any[]>([])

  useEffect(() => {
    // Load available capabilities on mount
    fetch("/api/chatbot")
      .then((res) => res.json())
      .then((data) => setCapabilities(data))
      .catch((error) => console.error("Error fetching capabilities:", error))
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: input,
          conversationHistory: conversationHistoryRef.current 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        
        // Update conversation history for context
        conversationHistoryRef.current.push({ role: "user", content: input })
        conversationHistoryRef.current.push({ role: "assistant", content: data.response })
      } else {
        const errorMessage: Message = {
          role: "assistant",
          content: `Error: ${data.error || "Failed to get response"}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Error: Failed to connect to the chatbot service.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            AI Chatbot with MCP
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Chat with Claude AI and access your database resources
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Chat Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about your data or request operations
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation by typing a message below</p>
                    <p className="text-sm mt-2">
                      Try: &quot;Show me all users&quot; or &quot;What resources are available?&quot;
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="rounded-full bg-blue-500 p-2">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="rounded-full bg-gray-500 p-2">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-blue-500 p-2">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    disabled={isLoading}
                    rows={2}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="h-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar with Capabilities */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Resources
                </CardTitle>
                <CardDescription>Available data sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {capabilities?.resources.length ? (
                  capabilities.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <p className="font-medium text-sm">{resource.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {resource.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Loading...</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Tools
                </CardTitle>
                <CardDescription>Available actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {capabilities?.tools.length ? (
                  capabilities.tools.map((tool, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {tool.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Loading...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

