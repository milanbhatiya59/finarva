"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Send } from "lucide-react"

const clientPersonas = [
  { id: "angry", name: "Angry Customer", description: "Frustrated and demanding immediate solutions" },
  { id: "curious", name: "Curious Customer", description: "Asks many questions and wants detailed information" },
  { id: "senior", name: "Senior Citizen", description: "Prefers simple explanations and traditional methods" },
  { id: "tech-savvy", name: "Tech-savvy Teen", description: "Wants latest features and digital solutions" },
  { id: "regional", name: "Regional (Hindi-speaker)", description: "Prefers Hindi communication" },
  { id: "low-trust", name: "Low Trust", description: "Skeptical and needs convincing" },
]

const agentPersonas = [
  { id: "calm", name: "Calm Agent", description: "Patient and composed in all situations" },
  { id: "fast-talker", name: "Fast-talker", description: "Speaks quickly and covers many points" },
  { id: "friendly", name: "Friendly Agent", description: "Warm and personable approach" },
  { id: "pushy", name: "Pushy Agent", description: "Aggressive sales tactics" },
  { id: "expert", name: "Product Expert", description: "Deep technical knowledge" },
  { id: "listener", name: "Listener", description: "Focuses on understanding customer needs" },
]

export default function PlaygroundPage() {
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("")
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<Array<{ role: string; content: string }>>([])
  const [analysis, setAnalysis] = useState<any>(null)

  const handleSendMessage = () => {
    if (!message.trim() || !selectedClient || !selectedAgent) return

    const newConversation = [
      ...conversation,
      { role: "user", content: message },
      { role: "assistant", content: "Thank you for your inquiry. Let me help you with that..." },
    ]

    setConversation(newConversation)
    setMessage("")

    // Mock analysis after conversation
    setTimeout(() => {
      setAnalysis({
        conversation_skills: { score: 85, applicable: true, reasoning: ["Good listening", "Clear communication"] },
        product_knowledge: {
          score: 78,
          applicable: true,
          reasoning: ["Accurate information", "Some gaps in advanced features"],
        },
        customer_engagement: { score: 92, applicable: true, reasoning: ["Excellent rapport building"] },
        professionalism: { score: 88, applicable: true, reasoning: ["Maintained professional tone"] },
        sales_effectiveness: { score: 75, applicable: true, reasoning: ["Good closing techniques"] },
        overall_rating: 84,
        overall_summary: "Strong performance with good customer engagement and professionalism.",
        key_strengths: ["Excellent listening skills", "Professional demeanor", "Good rapport building"],
        improvement_areas: ["Product knowledge depth", "Closing techniques"],
        missed_opportunities: ["Could have upsold premium features"],
        communication_missteps: ["Interrupted customer once"],
        recommended_actions: ["Study advanced product features", "Practice active listening"],
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Training Playground</h1>

      <Tabs defaultValue="simulation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="simulation">AI Simulation</TabsTrigger>
          <TabsTrigger value="clients">AI Clients</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="simulation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Setup */}
            <Card>
              <CardHeader>
                <CardTitle>Simulation Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Client Persona</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientPersonas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Agent Persona</Label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an agent persona" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentPersonas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!selectedClient || !selectedAgent}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Conversation */}
            <Card>
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                          : "bg-muted max-w-[80%]"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  {Object.entries(analysis)
                    .slice(0, 5)
                    .map(([key, value]: [string, any]) => (
                      <div key={key} className="text-center">
                        <h4 className="font-medium capitalize mb-2">{key.replace("_", " ")}</h4>
                        <div className="text-2xl font-bold">{value.score || 0}</div>
                      </div>
                    ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Overall Rating: {analysis.overall_rating}/100</h4>
                    <p className="text-muted-foreground">{analysis.overall_summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Strengths</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {analysis.key_strengths?.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Improvement Areas</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {analysis.improvement_areas?.map((area: string, index: number) => (
                          <li key={index}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="clients">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientPersonas.map((persona) => (
              <Card key={persona.id}>
                <CardHeader>
                  <CardTitle>{persona.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{persona.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentPersonas.map((persona) => (
              <Card key={persona.id}>
                <CardHeader>
                  <CardTitle>{persona.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{persona.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
