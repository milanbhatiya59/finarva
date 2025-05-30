"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  Shield,
  User,
  Phone,
  Mail,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MainNav } from "@/components/main-nav"
import { ChatDialog } from "@/components/chat-dialog"

const recommendedPlans = [
  {
    id: 1,
    name: "Health Guard Premium",
    company: "SecureLife Insurance",
    premium: "₹15,000",
    coverage: "₹10 Lakhs",
    features: ["Cashless Treatment", "No Claim Bonus", "Pre-existing Cover"],
    match: "95%",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-r from-pink-50 to-rose-50",
    icon: "💊",
  },
  {
    id: 2,
    name: "Family Protection Plus",
    company: "FamilyFirst Insurance",
    premium: "₹22,000",
    coverage: "₹15 Lakhs",
    features: ["Family Coverage", "Maternity Benefits", "Child Care"],
    match: "88%",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
    icon: "👨‍👩‍👧‍👦",
  },
]

const quickActions = [
  { name: "Schedule Call", icon: Phone, color: "from-green-500 to-emerald-500" },
  { name: "Generate Quote", icon: FileText, color: "from-blue-500 to-cyan-500" },
  { name: "Policy Comparison", icon: Shield, color: "from-purple-500 to-pink-500" },
  { name: "Send Reminder", icon: Calendar, color: "from-orange-500 to-red-500" },
]

export default function ClientDetailsPage() {
  const params = useParams()
  const clientId = params.id
  const [client, setClient] = useState(null)
  const [notes, setNotes] = useState("")
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]")
    const foundClient = clients.find((c) => c.id === Number.parseInt(clientId as string))
    setClient(foundClient)

    const savedNotes = localStorage.getItem(`notes_${clientId}`)
    if (savedNotes) setNotes(savedNotes)
  }, [clientId])

  const handleNotesChange = (e) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    localStorage.setItem(`notes_${clientId}`, newNotes)
  }

  if (!client) {
    return (
      <div className="min-h-screen">
        <MainNav />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Client not found</h2>
            <p className="text-gray-600 mb-6">The requested client could not be found.</p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              <User className="h-4 w-4" />
              Client Dashboard
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            {client.name}
          </h1>
          <p className="text-gray-600">Manage client relationship and track opportunities</p>
          <Button
            onClick={() => setShowChat(true)}
            className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Client Profile */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-2xl">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{client.name}</h3>
                    <p className="text-gray-600">Premium Client</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <div>
                      <label className="text-xs font-medium text-gray-500">Mobile</label>
                      <p className="font-medium text-gray-800">{client.mobileNumber}</p>
                    </div>
                  </div>

                  {client.email && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Mail className="h-4 w-4 text-green-500" />
                      <div>
                        <label className="text-xs font-medium text-gray-500">Email</label>
                        <p className="font-medium text-gray-800">{client.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <div>
                      <label className="text-xs font-medium text-gray-500">Joined</label>
                      <p className="font-medium text-gray-800">{new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {client.additionalFields?.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      {client.additionalFields.map((field, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            index % 3 === 0 ? "bg-blue-50" : index % 3 === 1 ? "bg-green-50" : "bg-orange-50"
                          }`}
                        >
                          <label className="text-xs font-medium text-gray-500">{field.title}</label>
                          <p className="font-medium text-gray-800">{field.description}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {client.documents?.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Documents</label>
                      <div className="flex flex-wrap gap-2">
                        {client.documents.map((doc, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                          >
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start border-2 border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mr-3`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      {action.name}
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <div>
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-xl h-[600px]">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Agent Notes
                </CardTitle>
                <CardDescription className="text-green-100">
                  Keep track of client interactions and important details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 h-full">
                <Textarea
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder="Write your notes about this client here..."
                  className="h-[450px] resize-none border-2 border-gray-200 focus:border-green-400 rounded-xl"
                />
              </CardContent>
            </Card>
          </div>

          {/* Recommended Plans */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />🎯 AI Recommendations
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Personalized insurance plans for this client
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {recommendedPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`${plan.bgColor} border-0 hover:shadow-lg transition-all duration-300 hover:scale-105`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{plan.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{plan.name}</h4>
                            <p className="text-sm text-gray-600">{plan.company}</p>
                          </div>
                        </div>
                        <Badge className={`bg-gradient-to-r ${plan.color} text-white border-0`}>
                          {plan.match} match
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="bg-white/70 rounded-lg p-2">
                          <span className="text-gray-600">Premium</span>
                          <p className="font-bold text-gray-800">{plan.premium}/year</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-2">
                          <span className="text-gray-600">Coverage</span>
                          <p className="font-bold text-gray-800">{plan.coverage}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex flex-wrap gap-1">
                          {plan.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-white/50">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-2 border-gray-200 hover:shadow-md"
                        asChild
                      >
                        <Link href={`/insurances/${plan.id}`}>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Client created</p>
                      <p className="text-xs text-gray-600">{new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Profile updated</p>
                      <p className="text-xs text-gray-600">Today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Notes added</p>
                      <p className="text-xs text-gray-600">Today</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ChatDialog open={showChat} onOpenChange={setShowChat} />
    </div>
  )
}
