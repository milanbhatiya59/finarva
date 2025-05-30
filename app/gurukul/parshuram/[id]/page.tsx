"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mic, Send, Pause, Play, Settings, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
    id: string
    content: string
    type: "user" | "ai"
    timestamp: string
    audioUrl?: string
}

// Mock conversation data
const mockConversation = {
    id: "1",
    clientType: "yudhishthir",
    clientName: "Dharma Kumar",
    status: "in-progress",
    messages: [
        {
            id: "1",
            content: "Hello! I'm interested in learning more about your insurance policies.",
            type: "ai",
            timestamp: "10:30 AM",
        },
        {
            id: "2",
            content: "I'd be happy to help you understand our policies. What type of coverage are you looking for?",
            type: "user",
            timestamp: "10:31 AM",
        },
        {
            id: "3",
            content: "I'm primarily concerned about my family's long-term security. We're a family of four, and I want to ensure they're well protected.",
            type: "ai",
            timestamp: "10:32 AM",
        },
    ],
    clientParams: {
        age: "45",
        occupation: "Government Official",
        income: "12 LPA",
        familySize: "4",
        riskTolerance: "Low",
        investmentStyle: "Conservative",
        primaryConcerns: ["Family Security", "Retirement Planning"],
        personality: "Yudhishthir - The Righteous Decision Maker",
        traits: ["Ethical", "Analytical", "Risk-Averse"],
    },
}

export default function ConversationPage() {
    const params = useParams()
    const router = useRouter()
    const [isRecording, setIsRecording] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [message, setMessage] = useState("")
    const [conversation, setConversation] = useState(mockConversation)
    const [editedParams, setEditedParams] = useState(mockConversation.clientParams)

    const handleSendMessage = () => {
        if (!message.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            content: message,
            type: "user",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
        }))

        setMessage("")

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                content: "Let me analyze that and provide a thoughtful response based on my personality...",
                type: "ai",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }

            setConversation((prev) => ({
                ...prev,
                messages: [...prev.messages, aiResponse],
            }))
        }, 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const toggleRecording = () => {
        setIsRecording(!isRecording)
        // Implement audio recording logic
    }

    const updateClientParams = (key: string, value: string) => {
        setEditedParams((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                            <Link href="/gurukul/parshuram">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{conversation.clientName}</h1>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-blue-600">
                                        {conversation.clientType}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            conversation.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                        }
                                    >
                                        {conversation.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Chat Interface */}
                    <div className="lg:col-span-2">
                        <Card className="h-[calc(100vh-16rem)] flex flex-col">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                <CardTitle>Training Conversation</CardTitle>
                                <CardDescription className="text-blue-100">
                                    Practice your sales approach with this AI client
                                </CardDescription>
                            </CardHeader>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {conversation.messages.map((msg) => (
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
                                                <div className="flex items-center justify-end gap-2 mt-1">
                                                    <span className="text-xs opacity-70">{msg.timestamp}</span>
                                                    {msg.audioUrl && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setIsPlaying(!isPlaying)}
                                                            className={msg.type === "user" ? "text-white" : "text-gray-600"}
                                                        >
                                                            {isPlaying ? (
                                                                <Pause className="h-4 w-4" />
                                                            ) : (
                                                                <Play className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
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
                                        placeholder="Type your message..."
                                        className="min-h-[60px] border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={toggleRecording}
                                            className={`border-2 ${isRecording
                                                    ? "border-red-400 text-red-500 hover:bg-red-50"
                                                    : "border-blue-200 text-blue-500 hover:bg-blue-50"
                                                }`}
                                        >
                                            <Mic className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={handleSendMessage}
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Client Parameters */}
                    <div>
                        <Card className="sticky top-8">
                            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                <CardTitle className="flex items-center justify-between">
                                    <span>Client Parameters</span>
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </CardTitle>
                                <CardDescription className="text-purple-100">
                                    Adjust client parameters in real-time
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {Object.entries(editedParams).map(([key, value]) => (
                                        <div key={key}>
                                            <Label className="text-sm font-medium text-gray-700">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </Label>
                                            {Array.isArray(value) ? (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {value.map((item) => (
                                                        <Badge key={item} variant="secondary">
                                                            {item}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Input
                                                    value={value}
                                                    onChange={(e) => updateClientParams(key, e.target.value)}
                                                    className="mt-1"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
} 