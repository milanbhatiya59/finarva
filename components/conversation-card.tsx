"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface ConversationCardProps {
  conversation: ConversationData
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const outcomeColors = {
    positive: "bg-green-500/10 text-green-700",
    neutral: "bg-yellow-500/10 text-yellow-700",
    negative: "bg-red-500/10 text-red-700",
  }

  const followUpColors = {
    NONE: "bg-gray-500/10 text-gray-700",
    CALL: "bg-blue-500/10 text-blue-700",
    EMAIL: "bg-purple-500/10 text-purple-700",
    MEETING: "bg-indigo-500/10 text-indigo-700",
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{conversation.name}</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className={outcomeColors[conversation.outcome]}>
            {conversation.outcome}
          </Badge>
          {conversation.follow_up_required && (
            <Badge variant="secondary" className={followUpColors[conversation.follow_up_type]}>
              {conversation.follow_up_type}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{conversation.summary}</p>
        
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Products & Interest</h4>
                <div className="space-y-1">
                  {Object.entries(conversation.customer_interest).map(([product, interest]) => (
                    <div key={product} className="flex justify-between text-sm">
                      <span>{product}</span>
                      <Badge variant="outline" className="capitalize">{interest}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Follow-up Details</h4>
                {conversation.follow_up_required ? (
                  <div className="space-y-1 text-sm">
                    <p>Type: {conversation.follow_up_type}</p>
                    {conversation.follow_up_datetime && (
                      <p>When: {new Date(conversation.follow_up_datetime).toLocaleString()}</p>
                    )}
                    {conversation.follow_up_notes && <p>Notes: {conversation.follow_up_notes}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No follow-up required</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Customer Interaction</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium">Questions Asked</h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {conversation.questions_asked.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Objections</h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {conversation.objections.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Next Steps</h4>
              <p className="text-sm font-medium">Next Best Action:</p>
              <p className="text-sm text-muted-foreground">{conversation.next_best_action}</p>
              <div className="mt-2">
                <p className="text-sm font-medium">Action Items:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {conversation.action_items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Knowledge & Explanation</h4>
                <p className="text-sm">Quality: {conversation.explanation_quality}</p>
                {conversation.knowledge_gaps.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Knowledge Gaps:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {conversation.knowledge_gaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Additional Info</h4>
                {conversation.competitor_mentions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Competitor Mentions:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {conversation.competitor_mentions.map((comp, i) => (
                        <li key={i}>{comp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Languages Used:</p>
                  <div className="flex flex-wrap gap-1">
                    {conversation.language_used.map((lang, i) => (
                      <Badge key={i} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 