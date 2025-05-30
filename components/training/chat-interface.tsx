"use client"

import { useState } from "react"
import { Mic, Send, Pause, Play, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Message {
    id: string
    content: string
    type: "user" | "ai"
    audioUrl?: string
}

interface ChatInterfaceProps {
    clientName: string
    messages: Message[]
    onSendMessage: (message: string) => void
    onStartRecording: () => void
    onStopRecording: () => void
    isRecording: boolean
    onPlayAudio: (audioUrl: string) => void
    isPlaying: boolean
    onOpenSettings: () => void
}

export function ChatInterface({
    clientName,
    messages,
    onSendMessage,
    onStartRecording,
    onStopRecording,
    isRecording,
    onPlayAudio,
    isPlaying,
    onOpenSettings,
}: ChatInterfaceProps) {
    const [message, setMessage] = useState("")

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim())
            setMessage("")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <Card className="flex flex-col h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-cyan-500">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                        {clientName[0].toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{clientName}</h3>
                        <p className="text-sm text-blue-100">AI Client</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenSettings}
                    className="text-white hover:bg-white/20"
                >
                    <Settings className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-3 ${msg.type === "user"
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                                {msg.audioUrl && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onPlayAudio(msg.audioUrl!)}
                                        className={`mt-2 ${msg.type === "user" ? "text-white hover:bg-white/20" : "text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
                <div className="flex items-end gap-2">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="min-h-[60px] border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={isRecording ? onStopRecording : onStartRecording}
                            className={`border-2 ${isRecording
                                    ? "border-red-400 text-red-500 hover:bg-red-50"
                                    : "border-blue-200 text-blue-500 hover:bg-blue-50"
                                }`}
                        >
                            {isRecording ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button
                            onClick={handleSend}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
} 