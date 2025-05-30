"use client"

import { useState, useEffect } from "react"
import { Plus, Search, TrendingUp, Users, Sparkles, Target, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChatDialog } from "@/components/chat-dialog"
import { Navbar } from "@/components/navbar"
import { NewClientDialog } from "@/components/new-client-dialog"
import { Client } from "@/types"

const trendingInsurances = [
  {
    id: 1,
    name: "Health Guard Premium",
    company: "SecureLife Insurance",
    premium: "₹15,000",
    commission: "15%",
    trending: "🔥 Hot",
    growth: "+25%",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-r from-pink-50 to-rose-50",
    icon: "💊",
  },
  {
    id: 2,
    name: "Family Protection Plus",
    company: "FamilyFirst Insurance",
    premium: "₹22,000",
    commission: "18%",
    trending: "⭐ Best",
    growth: "+30%",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: 3,
    name: "Senior Care Elite",
    company: "ElderCare Insurance",
    premium: "₹18,500",
    commission: "20%",
    trending: "💎 Premium",
    growth: "+22%",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-gradient-to-r from-emerald-50 to-teal-50",
    icon: "👴",
  },
]

const stats = [
  {
    title: "Total Clients",
    value: "0",
    icon: Users,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-gradient-to-r from-violet-50 to-purple-50",
  },
  {
    title: "Monthly Target",
    value: "₹2.5L",
    icon: Target,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-r from-orange-50 to-red-50",
  },
  {
    title: "Commission Earned",
    value: "₹45K",
    icon: Award,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
  },
]

export default function HomePage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [showNewClientDialog, setShowNewClientDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchClients = async () => {
    try {
      const response = await fetch('/client/clients.json')
      if (!response.ok) throw new Error('Failed to fetch clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleClientAdded = () => {
    // Refresh clients list
    fetchClients()
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.mobileNumber.includes(searchTerm),
  )

  // Update stats with actual client count
  stats[0].value = clients.length.toString()

  return (
    <div className="min-h-screen pt-16">
      <Navbar />

      <main className="container mx-auto px-4 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">
                        {isLoading ? "..." : stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Clients Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Users className="h-6 w-6" />
                      My Clients ({isLoading ? "..." : clients.length})
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Manage and track your client relationships
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowNewClientDialog(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    size="sm"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Client
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                  />
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Users className="h-12 w-12 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading clients...</h3>
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-12 w-12 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {clients.length === 0 ? "No clients yet!" : "No clients found"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {clients.length === 0
                        ? "Start building your client base today"
                        : "Try adjusting your search terms"}
                    </p>
                    {clients.length === 0 && (
                      <Button
                          onClick={() => setShowNewClientDialog(true)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-purple-600 text-white"
                      >
                          Add Your First Client
                      </Button>
                    )}
                  </div>
                ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredClients.map((client, index) => (
                      <Card
                        key={client.id}
                        className={`border-l-4 ${index % 3 === 0
                          ? "border-l-blue-400"
                          : index % 3 === 1
                            ? "border-l-purple-400"
                            : "border-l-emerald-400"
                          } hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r shadow-md ${index % 3 === 0
                              ? "from-blue-500 to-purple-500"
                              : index % 3 === 1
                                ? "from-purple-500 to-pink-500"
                                : "from-emerald-500 to-teal-500"
                              } flex items-center justify-center text-white font-bold text-lg`}>
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 truncate">{client.name}</h3>
                              <p className="text-gray-600 text-sm">{client.mobileNumber}</p>
                              {client.additionalFields?.length > 0 && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  +{client.additionalFields.length} fields
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 shrink-0"
                            >
                              <Link href={`/clients/${client.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trending Insurances */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-6 w-6" />🔥 Trending Plans
                </CardTitle>
                <CardDescription className="text-orange-100">Hot insurance products this month</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {trendingInsurances.map((insurance) => (
                  <Card
                    key={insurance.id}
                    className={`${insurance.bgColor} border-0 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{insurance.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{insurance.name}</h4>
                            <p className="text-xs text-gray-600">{insurance.company}</p>
                          </div>
                        </div>
                        <Badge className={`bg-gradient-to-r ${insurance.color} text-white border-0 text-xs`}>
                          {insurance.trending}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div className="bg-white/50 rounded-lg p-2">
                          <span className="text-gray-600">Premium</span>
                          <p className="font-bold text-gray-800">{insurance.premium}</p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-2">
                          <span className="text-gray-600">Commission</span>
                          <p className="font-bold text-green-600">{insurance.commission}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span className="text-xs font-medium text-green-600">{insurance.growth}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="text-xs h-7 px-3">
                          <Link href={`/insurances/${insurance.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                  asChild
                >
                  <Link href="/insurances">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Explore All Plans
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ChatDialog open={showChat} onOpenChange={setShowChat} />
      <NewClientDialog
        open={showNewClientDialog}
        onOpenChange={setShowNewClientDialog}
        onClientAdded={handleClientAdded}
      />
    </div>
  )
}
