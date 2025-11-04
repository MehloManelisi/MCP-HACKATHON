"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User, Loader2, Database, Wrench, MessageSquare, Clock, Trash2 } from "lucide-react"
import { PageWrapper } from "@/components/page-wrapper"

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

interface ChatHistory {
    id: string
    title: string
    lastMessage: string
    timestamp: Date
    messageCount: number
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [capabilities, setCapabilities] = useState<Capabilities | null>(null)
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Load available capabilities on mount
        fetch("/api/chatbot")
            .then((res) => res.json())
            .then((data) => setCapabilities(data))
            .catch((error) => console.error("Error fetching capabilities:", error))

        // Load chat history from localStorage on mount
        const savedHistory = localStorage.getItem("chatbot-history")
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory)
                // Convert timestamp strings back to Date objects
                const historyWithDates = parsed.map((chat: ChatHistory) => ({
                    ...chat,
                    timestamp: new Date(chat.timestamp),
                }))
                setChatHistory(historyWithDates)
            } catch (error) {
                console.error("Error loading chat history:", error)
            }
        }
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
                body: JSON.stringify({ message: input }),
            })

            const data = await response.json()

            if (response.ok) {
                const assistantMessage: Message = {
                    role: "assistant",
                    content: data.response,
                    timestamp: new Date(),
                }
                setMessages((prev) => [...prev, assistantMessage])
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

    const handleClearChat = () => {
        if (messages.length === 0) return

        // Get the first user message as the title
        const firstUserMessage = messages.find(m => m.role === "user")
        const title = firstUserMessage
            ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "")
            : "New Chat"

        // Create new chat history entry
        const newChatHistory: ChatHistory = {
            id: Date.now().toString(),
            title: title,
            lastMessage: messages[messages.length - 1].content.slice(0, 100) + (messages[messages.length - 1].content.length > 100 ? "..." : ""),
            timestamp: new Date(),
            messageCount: messages.length,
        }

        // Add to history and clear current messages
        setChatHistory(prev => {
            const updated = [newChatHistory, ...prev]
            // Save to localStorage for persistence
            try {
                localStorage.setItem("chatbot-history", JSON.stringify(updated))
            } catch (error) {
                console.error("Error saving chat history:", error)
            }
            return updated
        })
        setMessages([])
    }

    return (
        <PageWrapper title="AI Chatbot" description="Chat with Claude AI and access your database resources">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Chat Interface */}
                <div className="lg:col-span-3">
                    <Card className="h-[calc(100vh-200px)] min-h-[600px] flex flex-col bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
                        <CardHeader className="border-b border-zinc-700/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-3 text-orange-400">
                                        <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center border border-orange-500/30 shadow-md relative">
                                            <Image
                                                src="/logo.jpg"
                                                alt="AfyaLink Logo"
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        AI Chat Assistant
                                    </CardTitle>
                                    <CardDescription className="text-white/70">
                                        Ask questions about your data or request operations
                                    </CardDescription>
                                </div>
                                {messages.length > 0 && (
                                    <Button
                                        onClick={handleClearChat}
                                        className="rounded-full bg-zinc-800/50 border border-zinc-700/50 text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                                        size="sm"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear Chat
                                    </Button>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-white/70 py-12">
                                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md mx-auto mb-4">
                                        <Bot className="h-8 w-8 text-orange-400" />
                                    </div>
                                    <p className="text-lg font-semibold text-white mb-2">Start a conversation</p>
                                    <p className="text-sm text-white/60">
                                        Try: &quot;Show me all users&quot; or &quot;What resources are available?&quot;
                                    </p>
                                </div>
                            )}

                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
                                                <Bot className="h-5 w-5 text-orange-400" />
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[80%] rounded-3xl px-5 py-4 shadow-lg ${message.role === "user"
                                                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                                                : "bg-gradient-to-br from-zinc-800/90 to-zinc-700/90 text-white border border-zinc-700/50"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                                            {message.content}
                                        </p>
                                        <p
                                            className={`text-xs mt-3 ${message.role === "user"
                                                    ? "text-orange-100"
                                                    : "text-white/50"
                                                }`}
                                        >
                                            {message.timestamp.toLocaleTimeString()}
                                        </p>
                                    </div>

                                    {message.role === "user" && (
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-3xl bg-gradient-to-br from-zinc-700/80 to-zinc-800/80 flex items-center justify-center border border-zinc-600/50 shadow-md">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
                                            <Bot className="h-5 w-5 text-orange-400" />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-700/90 rounded-3xl px-5 py-4 border border-zinc-700/50 shadow-lg">
                                        <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </CardContent>

                        <div className="border-t border-zinc-700/50 p-4">
                            <div className="flex gap-2">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message here..."
                                    disabled={isLoading}
                                    rows={2}
                                    className="flex-1 rounded-2xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 resize-none"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center p-0"
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
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {/* Chat History */}
                    <Card className="flex flex-col bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10 max-h-[320px]">
                        <CardHeader className="border-b border-zinc-700/50 flex-shrink-0">
                            <CardTitle className="flex items-center gap-3 text-orange-400">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/30 shadow-md">
                                    <MessageSquare className="h-4 w-4 text-blue-400" />
                                </div>
                                Chat History
                            </CardTitle>
                            <CardDescription className="text-white/70">Previous conversations</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-2 pt-4 min-h-0">
                            {chatHistory.length > 0 ? (
                                chatHistory.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className="group p-3 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-2xl border border-orange-500/30 shadow-md shadow-orange-500/10 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-white truncate">{chat.title}</h4>
                                                <p className="text-xs text-white/60 mt-1 line-clamp-2">{chat.lastMessage}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setChatHistory(prev => {
                                                        const updated = prev.filter(c => c.id !== chat.id)
                                                        // Update localStorage
                                                        try {
                                                            localStorage.setItem("chatbot-history", JSON.stringify(updated))
                                                        } catch (error) {
                                                            console.error("Error saving chat history:", error)
                                                        }
                                                        return updated
                                                    })
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-lg"
                                            >
                                                <Trash2 className="h-3 w-3 text-red-400" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1 text-xs text-white/50">
                                                <Clock className="h-3 w-3" />
                                                <span>{new Date(chat.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-xs text-white/50">
                                                {chat.messageCount} messages
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <MessageSquare className="h-8 w-8 text-blue-400/50 mx-auto mb-2" />
                                    <p className="text-sm text-white/50">No chat history</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Resources and Tools - Combined in one card */}
                    <Card className="bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10 max-h-[400px] flex flex-col">
                        <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
                            {/* Resources Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center border border-green-500/30 shadow-md">
                                        <Database className="h-3.5 w-3.5 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-orange-400">Resources</h3>
                                        <p className="text-[10px] text-white/70">Available data sources</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    {capabilities?.resources.length ? (
                                        capabilities.resources.map((resource, index) => (
                                            <div
                                                key={index}
                                                className="p-2.5 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl border border-orange-500/30 shadow-md shadow-orange-500/10"
                                            >
                                                <p className="font-semibold text-xs text-white">{resource.name}</p>
                                                <p className="text-[10px] text-white/60 mt-0.5 line-clamp-1">
                                                    {resource.description}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-white/50">Loading...</p>
                                    )}
                                </div>
                            </div>

                            {/* Tools Section */}
                            <div className="pt-3 border-t border-zinc-700/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center border border-purple-500/30 shadow-md">
                                        <Wrench className="h-3.5 w-3.5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-orange-400">Tools</h3>
                                        <p className="text-[10px] text-white/70">Available actions</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    {capabilities?.tools.length ? (
                                        capabilities.tools.map((tool, index) => (
                                            <div
                                                key={index}
                                                className="p-2.5 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl border border-orange-500/30 shadow-md shadow-orange-500/10"
                                            >
                                                <p className="font-semibold text-xs text-white">{tool.name}</p>
                                                <p className="text-[10px] text-white/60 mt-0.5 line-clamp-1">
                                                    {tool.description}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-white/50">Loading...</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    )
}

