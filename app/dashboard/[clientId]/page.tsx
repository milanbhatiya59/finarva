"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ClientProfile } from "@/components/client-profile"
import { RecommendedInsurance } from "@/components/recommended-insurance"
import { AgentNotes } from "@/components/agent-notes"
import { InsuranceAssistant } from "@/components/insurance-assistant"

export default function Dashboard() {
  const params = useParams()
  const clientId = params.clientId
  const [client, setClient] = useState(null)
  const [notes, setNotes] = useState("")

  // Load client data and notes
  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]")
    const foundClient = clients.find((c) => c.id === Number.parseInt(clientId as string))
    setClient(foundClient)

    const savedNotes = localStorage.getItem(`notes_${clientId}`)
    if (savedNotes) setNotes(savedNotes)
  }, [clientId])

  // Save notes to localStorage
  const handleNotesChange = (e) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    localStorage.setItem(`notes_${clientId}`, newNotes)
  }

  if (!client) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Client not found</h2>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section - Client Profile & Recommended Insurance */}
        <div className="w-full lg:w-1/3 space-y-6">
          <ClientProfile client={client} />
          <RecommendedInsurance />
        </div>

        {/* Middle Section - Notes */}
        <div className="w-full lg:w-1/3">
          <AgentNotes notes={notes} onNotesChange={handleNotesChange} />
        </div>

        {/* Right Section - Chatbot */}
        <div className="w-full lg:w-1/3">
          <InsuranceAssistant />
        </div>
      </div>
    </div>
  )
}
