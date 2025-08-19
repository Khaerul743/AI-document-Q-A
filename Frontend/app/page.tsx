"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Bot, FileText, Paperclip, Send, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  file?: {
    name: string
    size: number
  }
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typingText])

  // Typing animation effect
  const typeMessage = (text: string, callback?: () => void) => {
    setIsTyping(true)
    setTypingText("")
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTypingText((prev) => prev + text.charAt(index))
        index++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        setTypingText("")
        callback?.()
      }
    }, 10) // Adjust typing speed here
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      file: selectedFile
        ? {
            name: selectedFile.name,
            size: selectedFile.size,
          }
        : undefined,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      let response

      if (selectedFile) {
        // Send message with file
        const formData = new FormData()
        formData.append("message", inputMessage)
        formData.append("file", selectedFile)

        response = await fetch("http://backend:8000/api/agent/document", {
          method: "POST",
          body: formData,
        })
        setSelectedFile(null)
      } else {
        // Send text message only
        response = await fetch("http://backend:8000/api/agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage,
          }),
        })
      }

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      // Create AI message placeholder
      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: Message = {
        id: aiMessageId,
        type: "ai",
        content: "",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)

      // Start typing animation
      typeMessage(data.response, () => {
        setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, content: data.response } : msg)))
      })
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="flex flex-col h-screen bg-background dark">
      {/* Header */}
      <div className="border-b border-border p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center">
            <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">AI Agent</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Your intelligent assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-2 sm:p-4" ref={scrollAreaRef}>
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Selamat datang di AI Agent</h2>
              <p className="text-sm sm:text-base text-muted-foreground px-4">Mulai percakapan dengan mengirim pesan atau upload file</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-2 sm:gap-3 max-w-full sm:max-w-3xl", message.type === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              <div
                className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {message.type === "user" ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4" />}
              </div>

              <Card
                className={cn(
                  "p-3 sm:p-4 max-w-[85%] sm:max-w-[80%]",
                  message.type === "user" ? "bg-primary text-primary-foreground" : "bg-card",
                )}
              >
                {message.file && (
                  <div className="flex items-center gap-2 mb-2 p-2 rounded bg-muted/50">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium truncate">{message.file.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">({formatFileSize(message.file.size)})</span>
                  </div>
                )}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
              </Card>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 sm:gap-3 max-w-full sm:max-w-3xl mr-auto">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <Card className="p-3 sm:p-4 max-w-[85%] sm:max-w-[80%] bg-card">
                <p className="text-xs sm:text-sm leading-relaxed">
                  {typingText}
                  <span className="animate-pulse">|</span>
                </p>
              </Card>
            </div>
          )}

          {isLoading && !isTyping && (
            <div className="flex gap-2 sm:gap-3 max-w-full sm:max-w-3xl mr-auto">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <Card className="p-3 sm:p-4 bg-card">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">AI sedang berpikir...</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          {selectedFile && (
            <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">({formatFileSize(selectedFile.size)})</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="ml-2 flex-shrink-0">
                ×
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />

            <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-9 h-9 sm:w-10 sm:h-10">
              <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>

            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan Anda..."
              disabled={isLoading}
              className="flex-1 text-sm sm:text-base"
            />

            <Button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputMessage.trim() && !selectedFile)}
              size="icon"
              className="w-9 h-9 sm:w-10 sm:h-10"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
