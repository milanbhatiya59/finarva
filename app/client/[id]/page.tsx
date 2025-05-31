"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ConversationUploadDialog } from "@/components/conversation-upload-dialog"
import { ConversationCard } from "@/components/conversation-card"

interface ClientData {
  id: string
  name: string
  number: string
  conversations: string[]
}

interface ConversationData {
  name: string
  summary: string
  outcome: "positive" | "neutral" | "negative"
  outcome_reason: string
  follow_up_required: boolean
  follow_up_type: "NONE" | "CALL" | "EMAIL" | "MEETING"
  follow_up_datetime: string | null
  follow_up_notes: string | null
  products_discussed: string[]
  customer_interest: Record<string, "high" | "medium" | "low">
  objections: string[]
  questions_asked: string[]
  needs_expressed: string[]
  knowledge_gaps: string[]
  explanation_quality: string
  competitor_mentions: string[]
  next_best_action: string
  action_items: string[]
  language_used: string[]
}

export default function ClientPage({ params }: { params: { id: string } }) {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load client data from clients.json
    fetch('/client/clients.json')
      .then(response => response.json())
      .then(clients => {
        const client = clients.find((c: ClientData) => c.id === params.id)
        if (client) {
          setClientData(client)
          // For now, we'll keep conversations empty as they're not part of the current scope
          setConversations([])
        }
      })
      .catch(error => console.error('Error loading client:', error))
  }, [params.id])

  const handleClientUpdate = async (field: string, value: string) => {
    if (!clientData) return

    const updatedClient = { ...clientData, [field]: value }

    try {
      // Send PUT request to update client
      const response = await fetch(`/api/clients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      })

      if (!response.ok) {
        throw new Error('Failed to update client')
      }

      setClientData(updatedClient)
    } catch (error) {
      console.error('Error updating client:', error)
      toast({
        title: "Error",
        description: "Failed to update client information",
        variant: "destructive",
      })
    }
  }

  const handleConversationUpload = async (file: File, name: string) => {
    if (!clientData) return

    try {
      // TODO: Replace with actual API call to upload and analyze conversation
      const mockResponse: ConversationData = {
        name,
        summary: "Customer showed interest in premium package. Discussed pricing and features.",
        outcome: "positive",
        outcome_reason: "Customer asked detailed questions about features",
        follow_up_required: true,
        follow_up_type: "CALL",
        follow_up_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        follow_up_notes: "Follow up on pricing concerns",
        products_discussed: ["Premium Package", "Basic Plan"],
        customer_interest: { "Premium Package": "high", "Basic Plan": "medium" },
        objections: ["Price concerns"],
        questions_asked: ["What's included in premium?", "Any discounts available?"],
        needs_expressed: ["Better features", "Value for money"],
        knowledge_gaps: [],
        explanation_quality: "Good",
        competitor_mentions: [],
        next_best_action: "Send detailed pricing breakdown",
        action_items: ["Prepare custom quote", "Schedule follow-up call"],
        language_used: ["English"]
      }

      setConversations([...conversations, mockResponse])
      toast({
        title: "Success",
        description: "Conversation uploaded and analyzed successfully",
      })
    } catch (error) {
      console.error('Error uploading conversation:', error)
      toast({
        title: "Error",
        description: "Failed to upload and analyze conversation",
        variant: "destructive",
      })
    }
  }

  if (!clientData) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side - Client Info */}
        <div className="lg:col-span-4">
          <div className="sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={clientData.name} 
                    onChange={(e) => handleClientUpdate("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Mobile Number</Label>
                  <Input
                    id="number"
                    value={clientData.number}
                    onChange={(e) => handleClientUpdate("number", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Conversations */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Conversations</h2>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Conversation
            </Button>
          </div>

          <div className="space-y-4">
            {conversations.map((conversation, index) => (
              <ConversationCard key={index} conversation={conversation} />
            ))}
            {conversations.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground text-center">
                    No conversations yet. Upload a conversation to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ConversationUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleConversationUpload}
      />
    </div>
  )
}
