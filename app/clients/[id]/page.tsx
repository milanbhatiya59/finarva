"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Client } from "@/types"
import { Navbar } from "@/components/navbar"

export default function ClientPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true)
        setError("")

        // Try to fetch from individual client file first
        let response = await fetch(`/client/clients/${params.id}.json`)

        if (!response.ok) {
          // If not found, try to find in the main clients list
          response = await fetch('/client/clients.json')
          if (!response.ok) throw new Error('Failed to fetch client')

          const clients = await response.json()
          const foundClient = clients.find((c: Client) => c.id === params.id)
          if (!foundClient) throw new Error('Client not found')

          setClient(foundClient)
        } else {
          const data = await response.json()
          setClient(data)
        }
      } catch (error) {
        console.error('Error fetching client:', error)
        setError('Failed to load client details')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchClient()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
              <div className="bg-white rounded-lg shadow-lg">
                <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="min-h-screen pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {error || "Client not found"}
            </h2>
            <Button asChild>
              <Link href="/">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-start gap-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mt-1"
          >
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          {/* Client Details */}
          <div className="flex-1 max-w-2xl">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Client Details</p>
                    <h2 className="text-xl font-bold">{client.name}</h2>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{client.mobileNumber}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Age</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{client.age} years</p>
                  </div>

                  {client.additionalFields && client.additionalFields.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Additional Information</h3>
                      <div className="space-y-3">
                        {client.additionalFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                          >
                            <h4 className="font-medium text-gray-900">{field.title}</h4>
                            <p className="text-gray-600 mt-1">{field.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
