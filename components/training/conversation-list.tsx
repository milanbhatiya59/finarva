"use client"

import { MessageCircle, Calendar, Play, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Conversation {
    id: string
    clientName: string
    date: string
    summary: string
    duration: string
    status: "completed" | "in-progress"
}

interface ConversationListProps {
    conversations: Conversation[]
    onSelect: (id: string) => void
    onReplay: (id: string) => void
    onAnalyze: (id: string) => void
    selectedId?: string
}

export function ConversationList({
    conversations,
    onSelect,
    onReplay,
    onAnalyze,
    selectedId,
}: ConversationListProps) {
    return (
        <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Previous Conversations
                </CardTitle>
                <CardDescription className="text-purple-100">Your training history</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-13rem)]">
                    <div className="p-4 space-y-4">
                        {conversations.map((conv) => (
                            <Card
                                key={conv.id}
                                className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${selectedId === conv.id
                                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-l-purple-500"
                                        : "bg-white border-l-transparent hover:border-l-purple-300"
                                    }`}
                                onClick={() => onSelect(conv.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{conv.clientName}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                {conv.date}
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        conv.status === "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }
                                                >
                                                    {conv.status === "completed" ? "Completed" : "In Progress"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-gray-600">
                                            {conv.duration}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{conv.summary}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onReplay(conv.id)
                                            }}
                                            className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                                        >
                                            <Play className="h-4 w-4 mr-2" />
                                            Replay
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onAnalyze(conv.id)
                                            }}
                                            className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                                        >
                                            <BarChart className="h-4 w-4 mr-2" />
                                            Analyze
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {conversations.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="h-8 w-8 text-purple-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">No conversations yet</h3>
                                <p className="text-gray-600">Start a new conversation to begin training</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
} 