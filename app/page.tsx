"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, User } from "lucide-react"
import { CreateClientModal } from "@/components/create-client-modal"
import { ClientCard } from "@/components/client-card"

interface Client {
  id: string
  name: string
  number: string
}

const skillsData = [
  { name: "Conversation Skills", progress: 75, color: "bg-blue-500" },
  { name: "Product Knowledge", progress: 82, color: "bg-green-500" },
  { name: "Customer Engagement", progress: 68, color: "bg-yellow-500" },
  { name: "Professionalism", progress: 90, color: "bg-purple-500" },
  { name: "Sales Effectiveness", progress: 73, color: "bg-red-500" },
]

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    // Load clients from clients.json
    fetch('/client/clients.json')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error loading clients:', error))
  }, [])

  const handleCreateClient = async (clientData: { name: string; number: string }) => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: clientData.name,
      number: clientData.number,
    }

    const updatedClients = [...clients, newClient]

    try {
      // Send POST request to update clients.json
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      })

      if (!response.ok) {
        throw new Error('Failed to create client')
      }

      setClients(updatedClients)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating client:', error)
      // Handle error (show toast notification, etc.)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Skills Progress Section */}
        <div>
          <h1 className="text-3xl font-bold mb-6">Performance Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {skillsData.map((skill) => (
              <Card key={skill.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{skill.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={skill.progress} className="h-2" />
                    <p className="text-2xl font-bold">{skill.progress}%</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Clients Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Clients</h2>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Client
            </Button>
          </div>

          {clients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No clients yet. Create your first client to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateClient} />
    </div>
  )
}
