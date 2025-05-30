"use client"

import { useState } from "react"
import { Search, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"

const insurancePlans = [
  {
    id: 1,
    name: "Health Guard Premium",
    company: "SecureLife Insurance",
    type: "Health Insurance",
    description: "Comprehensive health coverage with cashless treatment and no claim bonus benefits",
    premium: "₹15,000",
    coverage: "₹10 Lakhs",
    commission: "15%",
    claims: "98%",
    trending: "🔥 Hot",
    features: ["Cashless Treatment", "No Claim Bonus", "Pre-existing Cover"],
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-r from-pink-50 to-rose-50",
    icon: "💊",
  },
  {
    id: 2,
    name: "Family Protection Plus",
    company: "FamilyFirst Insurance",
    type: "Family Health Insurance",
    description: "Complete family protection with maternity benefits and child care coverage",
    premium: "₹22,000",
    coverage: "₹15 Lakhs",
    commission: "18%",
    claims: "95%",
    trending: "⭐ Best",
    features: ["Family Coverage", "Maternity Benefits", "Child Care"],
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: 3,
    name: "Senior Care Elite",
    company: "ElderCare Insurance",
    type: "Senior Citizen Health",
    description: "Specialized coverage designed for senior citizens with comprehensive benefits",
    premium: "₹18,500",
    coverage: "₹12 Lakhs",
    commission: "20%",
    claims: "97%",
    trending: "💎 Premium",
    features: ["Senior Focused", "No Age Limit", "Chronic Disease Cover"],
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-gradient-to-r from-emerald-50 to-teal-50",
    icon: "👴",
  },
  {
    id: 4,
    name: "Critical Care Shield",
    company: "LifeGuard Insurance",
    type: "Critical Illness",
    description: "Protection against critical illnesses with lump sum payout benefits",
    premium: "₹12,000",
    coverage: "₹25 Lakhs",
    commission: "22%",
    claims: "96%",
    trending: "💰 High Commission",
    features: ["Lump Sum Payout", "Multiple Claims", "Survival Benefit"],
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-r from-orange-50 to-red-50",
    icon: "🛡️",
  },
]

export default function InsurancesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const filteredPlans = insurancePlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || plan.type.toLowerCase().includes(selectedType.toLowerCase())
    return matchesSearch && matchesType
  })

  const planTypes = [
    { value: "all", label: "All Plans", color: "from-gray-500 to-gray-600" },
    { value: "health", label: "Health", color: "from-pink-500 to-rose-500" },
    { value: "family", label: "Family", color: "from-blue-500 to-cyan-500" },
    { value: "senior", label: "Senior", color: "from-emerald-500 to-teal-500" },
    { value: "critical", label: "Critical", color: "from-orange-500 to-red-500" },
  ]

  return (
    <div className="min-h-screen">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Insurance Marketplace
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Explore Insurance Plans
          </h1>
          <p className="text-gray-600">Discover the best insurance products for your clients</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search insurance plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border-2 border-gray-200 focus:border-blue-400 rounded-xl h-12"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {planTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.value)}
                    className={
                      selectedType === type.value
                        ? `bg-gradient-to-r ${type.color} text-white border-0 shadow-lg`
                        : "border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                    }
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`${plan.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{plan.icon}</div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-gray-900 transition-colors">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-600">{plan.company}</CardDescription>
                      <Badge variant="outline" className="mt-2 text-xs border-gray-300">
                        {plan.type}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={`bg-gradient-to-r ${plan.color} text-white border-0 shadow-lg`}>
                    {plan.trending}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 line-clamp-2">{plan.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Premium</p>
                    <p className="font-bold text-gray-800">{plan.premium}/year</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Coverage</p>
                    <p className="font-bold text-gray-800">{plan.coverage}</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Commission</p>
                    <p className="font-bold text-green-600">{plan.commission}</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Claims Ratio</p>
                    <p className="font-bold text-blue-600">{plan.claims}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-600">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-white/50">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  asChild
                  className={`w-full bg-gradient-to-r ${plan.color} hover:shadow-lg transition-all duration-300 text-white border-0`}
                >
                  <Link href={`/insurances/${plan.id}`}>
                    <Shield className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No plans found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedType("all")
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
