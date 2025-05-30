"use client"

import { useState } from "react"
import { Plus, MessageCircle, User, Brain, Sparkles, Calendar, Zap } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for previous conversations
const mockConversations = [
    {
        id: "1",
        clientType: "Yudhishthir",
        clientName: "Dharma Kumar",
        lastMessage: "I understand your concerns about the premium, but let me explain the long-term benefits...",
        date: "2024-03-15",
        duration: "15 mins",
        status: "completed",
        performance: 85,
    },
    {
        id: "2",
        clientType: "Karna",
        clientName: "Surya Prasad",
        lastMessage: "I appreciate your directness. Let's discuss how this policy aligns with your values...",
        date: "2024-03-14",
        duration: "20 mins",
        status: "completed",
        performance: 92,
    },
    {
        id: "3",
        clientType: "Arjuna",
        clientName: "Vijay Sharma",
        lastMessage: "Your analytical approach is commendable. Now, regarding the coverage options...",
        date: "2024-03-13",
        duration: "25 mins",
        status: "in-progress",
        performance: 78,
    },
]

export default function ParshuramPage() {
    const router = useRouter()
    const pathname = usePathname()
    const currentTab = pathname.includes("/gurukul/parshuram") ? "parashurama" : "dronacharya"

    const handleTabChange = (value: string) => {
        if (value === "parashurama") {
            router.push("/gurukul/parshuram")
        } else {
            router.push("/gurukul/dronacharya")
        }
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    <Tabs
                        defaultValue={currentTab}
                        className="w-full flex gap-8"
                        orientation="vertical"
                        onValueChange={handleTabChange}
                        value={currentTab}
                    >
                        <TabsList className="h-[200px] w-[200px] flex flex-col space-x-0 space-y-2 bg-transparent">
                            <TabsTrigger
                                value="dronacharya"
                                className="w-full justify-start gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                            >
                                <Zap className="h-4 w-4" />
                                Dronacharya
                            </TabsTrigger>
                            <TabsTrigger
                                value="parashurama"
                                className="w-full justify-start gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                            >
                                <Brain className="h-4 w-4" />
                                Parashurama
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1">
                            <TabsContent value="parashurama">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full text-lg font-medium">
                                        <Brain className="h-5 w-5" />
                                        Parashurama Training Module
                                    </div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mt-4">
                                        Master the Art of Insurance Sales
                                    </h1>
                                    <p className="text-gray-600 text-lg mt-2 max-w-2xl mx-auto">
                                        Practice your sales skills with AI-powered clients, each with unique personalities and challenges
                                    </p>
                                </div>

                                {/* Action Button */}
                                <div className="flex justify-center mb-8">
                                    <Button
                                        onClick={() => router.push('/parshuram/new-parshuram')}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                        size="lg"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Create New Training Session
                                    </Button>
                                </div>

                                {/* Previous Conversations */}
                                <div className="grid gap-6">
                                    <h2 className="text-2xl font-semibold text-gray-800">Previous Training Sessions</h2>

                                    <div className="grid gap-4">
                                        {mockConversations.map((conversation) => (
                                            <Card
                                                key={conversation.id}
                                                className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-blue-400"
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white">
                                                                <User className="h-6 w-6" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-800">{conversation.clientName}</h3>
                                                                <p className="text-sm text-gray-600">Type: {conversation.clientType}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className={conversation.status === "completed"
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-blue-100 text-blue-700"}
                                                                    >
                                                                        {conversation.status === "completed" ? "Completed" : "In Progress"}
                                                                    </Badge>
                                                                    <Badge variant="outline" className="text-gray-600">
                                                                        {conversation.duration}
                                                                    </Badge>
                                                                    <Badge
                                                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                                                    >
                                                                        Score: {conversation.performance}%
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                                            asChild
                                                        >
                                                            <Link href={`/gurukul/parshuram/${conversation.id}`}>
                                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                                Continue
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                                        {conversation.lastMessage}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                        <Calendar className="h-3 w-3" />
                                                        {conversation.date}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="dronacharya">
                                {/* Dronacharya content */}
                                <div className="text-center py-12">
                                    <h2 className="text-2xl font-semibold text-gray-800">Coming Soon</h2>
                                    <p className="text-gray-600 mt-2">The Dronacharya module is under development.</p>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </main>
        </div>
    )
} 