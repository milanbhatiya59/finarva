"use client"

import { Clock, Phone, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"

const clientHistory = [
  {
    id: 1,
    name: "John Doe",
    date: "2024-03-15",
    status: "Active",
    insurance: "Health Guard Premium",
    lastAction: "Policy Renewed",
    value: "₹15,000",
    avatar: "JD",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 2,
    name: "Jane Smith",
    date: "2024-03-14",
    status: "Pending",
    insurance: "Family Protection Plus",
    lastAction: "Documents Submitted",
    value: "₹22,000",
    avatar: "JS",
    color: "from-purple-400 to-pink-400",
  },
  {
    id: 3,
    name: "Robert Johnson",
    date: "2024-03-13",
    status: "Active",
    insurance: "Senior Care Elite",
    lastAction: "Premium Paid",
    value: "₹18,500",
    avatar: "RJ",
    color: "from-green-400 to-emerald-400",
  },
]

const callHistory = [
  {
    id: 1,
    clientName: "John Doe",
    date: "2024-03-15",
    time: "10:30 AM",
    duration: "15 mins",
    topic: "Policy Renewal Discussion",
    outcome: "Positive",
    notes: "Client agreed to renew policy with additional coverage",
    followUp: "2024-04-15",
    avatar: "JD",
    color: "from-green-400 to-emerald-400",
  },
  {
    id: 2,
    clientName: "Jane Smith",
    date: "2024-03-14",
    time: "2:15 PM",
    duration: "25 mins",
    topic: "Document Collection",
    outcome: "Pending",
    notes: "Waiting for address proof document",
    followUp: "2024-03-20",
    avatar: "JS",
    color: "from-orange-400 to-red-400",
  },
  {
    id: 3,
    clientName: "Robert Johnson",
    date: "2024-03-13",
    time: "4:45 PM",
    duration: "12 mins",
    topic: "Premium Payment",
    outcome: "Completed",
    notes: "Payment processed successfully",
    followUp: null,
    avatar: "RJ",
    color: "from-blue-400 to-cyan-400",
  },
]

const stats = [
  {
    title: "Total Interactions",
    value: "156",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
  },
  {
    title: "Successful Calls",
    value: "89%",
    icon: Phone,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
  },
  {
    title: "This Month",
    value: "24",
    icon: Calendar,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
  },
]

export default function HistoryPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Clock className="h-4 w-4" />
            Activity History
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Track Your Success
          </h1>
          <p className="text-gray-600">Monitor client interactions and business performance</p>
        </div>

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
                      <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
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

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-lg rounded-xl border-0">
            <TabsTrigger
              value="clients"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg"
            >
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger
              value="calls"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
            >
              <Phone className="h-4 w-4" />
              Calls
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Client Activity History
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Recent client interactions and policy updates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {clientHistory.map((client) => (
                    <Card
                      key={client.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4 mb-3">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${client.color} flex items-center justify-center text-white font-bold shadow-lg`}
                          >
                            {client.avatar}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{client.name}</h3>
                            <p className="text-sm text-gray-600">{client.insurance}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={
                                client.status === "Active"
                                  ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white border-0"
                                  : "bg-gradient-to-r from-orange-400 to-red-400 text-white border-0"
                              }
                            >
                              {client.status}
                            </Badge>
                            <p className="text-sm font-bold text-gray-800 mt-1">{client.value}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Last Action:</span>
                            <span className="font-medium text-gray-800">{client.lastAction}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {client.date}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call History
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Record of all client calls and conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {callHistory.map((call) => (
                    <Card
                      key={call.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4 mb-3">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${call.color} flex items-center justify-center text-white font-bold shadow-lg`}
                          >
                            {call.avatar}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">Call with {call.clientName}</h3>
                            <p className="text-sm text-gray-600">{call.topic}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div className="flex items-center gap-1 justify-end">
                              <Clock className="h-4 w-4" />
                              {call.duration}
                            </div>
                            <p className="mt-1">
                              {call.date} at {call.time}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Outcome:</span>
                            <Badge
                              className={
                                call.outcome === "Positive"
                                  ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white border-0"
                                  : call.outcome === "Completed"
                                    ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-0"
                                    : "bg-gradient-to-r from-orange-400 to-red-400 text-white border-0"
                              }
                            >
                              {call.outcome}
                            </Badge>
                          </div>

                          <div>
                            <span className="text-sm text-gray-600">Notes:</span>
                            <p className="text-sm mt-1 text-gray-800">{call.notes}</p>
                          </div>

                          {call.followUp && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600">Follow-up:</span>
                              <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0">
                                {call.followUp}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
