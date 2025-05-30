"use client"

import type React from "react"
import { useState } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "🎉 Hello! I'm your AI insurance assistant powered by advanced algorithms. I can help you with policy recommendations, client analysis, market insights, and much more. What would you like to explore today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const quickSuggestions = [
    "🎯 Recommend plans for my client",
    "📊 Show market trends",
    "💡 Sales tips for today",
    "📈 Commission calculator",
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    const aiResponse: Message = {
      id: Date.now() + 1,
      text: "🤖 Great question! Based on your client's profile and current market trends, I recommend focusing on our Health Guard Premium plan. It has a 98% customer satisfaction rate and offers excellent commission potential. The plan features comprehensive coverage with cashless treatment at 10,000+ hospitals. Would you like me to generate a personalized quote or provide more details about the benefits?",
      sender: "ai",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, aiResponse])
    setNewMessage("")
  }

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion.replace(/[🎯📊💡📈]/gu, "").trim())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[700px] flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 border-0 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg p-6 -m-6 mb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <span>AI Assistant</span>
              <Badge className="ml-2 bg-white/20 text-white text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Smart
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-purple-100">Your intelligent insurance companion</DialogDescription>
        </DialogHeader>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-gray-600">Quick suggestions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs h-auto p-2 border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-gray-200">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask me anything about insurance..."
            className="flex-1 border-2 border-purple-200 focus:border-purple-400 rounded-xl"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
