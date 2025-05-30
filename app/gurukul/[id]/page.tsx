"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, Shield, TrendingUp, Users, FileText, CheckCircle, Star, Award, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"

const insuranceDetails = {
  1: {
    id: 1,
    name: "Health Guard Premium",
    company: "SecureLife Insurance",
    type: "Health Insurance",
    description:
      "Comprehensive health coverage with cashless treatment and no claim bonus benefits for individuals and families",
    premium: "₹15,000",
    premiumRange: "₹12,000 - ₹45,000",
    coverage: "₹5 Lakhs - ₹50 Lakhs",
    commission: "15%",
    claims: "98%",
    trending: "🔥 Most Popular",
    icon: "💊",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-gradient-to-r from-pink-50 to-rose-50",
    benefits: [
      "Cashless Treatment at 10,000+ Hospitals",
      "No Claim Bonus up to 50%",
      "Pre-existing Disease Cover after 2 years",
      "Day Care Procedures Covered",
      "Annual Health Check-up",
      "Ambulance Coverage",
      "Mental Health Coverage",
    ],
    features: {
      "Waiting Period": "2 years for pre-existing diseases",
      "Co-payment": "10% for specified treatments",
      "Room Rent Limit": "No capping on room rent",
      "Pre & Post Hospitalization": "60 & 90 days respectively",
      "Maternity Coverage": "Available with 3-year waiting period",
      "Age Limit": "Entry age 18-65 years",
    },
    agentInfo: {
      "First Year Commission": "15% of premium",
      "Renewal Commission": "7.5% from second year",
      "Quarterly Bonus": "Additional 5% on targets",
      "Training Support": "Comprehensive product training",
      "Marketing Materials": "Digital and print materials",
      "Lead Support": "Qualified leads provided",
    },
    businessMetrics: {
      "Claims Settlement Ratio": "98.2%",
      "Claim Processing Time": "3-5 working days",
      "Customer Satisfaction": "4.5/5 stars",
      "Market Share": "15% in health insurance",
      "Growth Rate": "25% year-over-year",
      "Policy Renewals": "92% renewal rate",
    },
    targetSegments: {
      "Primary Age Group": "25-60 years",
      "Income Range": "₹5-15 LPA",
      Occupation: "Salaried professionals",
      Geography: "Tier 1 & 2 cities",
      "Family Size": "2-6 members",
      "Risk Profile": "Low to medium risk",
    },
    documents: [
      "Age Proof (Birth Certificate/Passport)",
      "Identity Proof (Aadhar/PAN Card)",
      "Address Proof (Utility Bill)",
      "Income Proof (Salary Slips)",
      "Medical Reports (if applicable)",
      "Passport Size Photographs",
    ],
  },
}

export default function InsuranceDetailsPage() {
  const params = useParams()
  const id = Number.parseInt(params.id as string)
  const insurance = insuranceDetails[id]

  if (!insurance) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Insurance plan not found</h2>
            <p className="text-gray-600 mb-6">The requested insurance plan could not be found.</p>
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Link href="/insurances">Browse All Plans</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

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
              <Link href="/insurances">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="h-4 w-4" />
              Insurance Details
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-4xl">{insurance.icon}</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {insurance.name}
              </h1>
              <p className="text-gray-600">
                {insurance.company} • {insurance.type}
              </p>
            </div>
            <Badge className={`bg-gradient-to-r ${insurance.color} text-white border-0 shadow-lg text-sm px-3 py-1`}>
              {insurance.trending}
            </Badge>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">{insurance.description}</p>
          <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg">
            <Star className="h-4 w-4 mr-2" />
            Generate Quote
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{insurance.coverage}</p>
              <p className="text-xs text-gray-600">Coverage Range</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-600">{insurance.commission}</p>
              <p className="text-xs text-gray-600">Commission</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{insurance.claims}</p>
              <p className="text-xs text-gray-600">Claims Ratio</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{insurance.premiumRange}</p>
              <p className="text-xs text-gray-600">Premium Range</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Benefits & Features */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Key Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {insurance.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-800">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Policy Features
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(insurance.features).map(([key, value], index) => (
                    <div key={key} className="p-3 bg-white rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-800">{key}</span>
                        <span className="text-sm text-gray-600 text-right max-w-[60%]">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent & Business Info */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Agent Information
                </CardTitle>
                <CardDescription className="text-purple-100">Commission structure and support details</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(insurance.agentInfo).map(([key, value], index) => (
                    <div key={key} className="p-3 bg-white rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-800">{key}</span>
                        <span className="text-sm text-gray-600 text-right max-w-[60%]">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Business Metrics
                </CardTitle>
                <CardDescription className="text-orange-100">Performance and market data</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(insurance.businessMetrics).map(([key, value], index) => (
                    <div key={key} className="p-3 bg-white rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-800">{key}</span>
                        <span className="text-sm text-gray-600 text-right max-w-[60%]">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Target Segments & Documents */}
        <div className="grid gap-8 lg:grid-cols-2 mt-8">
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Target Customer Segments
              </CardTitle>
              <CardDescription className="text-indigo-100">Ideal customer profiles for this plan</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Object.entries(insurance.targetSegments).map(([key, value], index) => (
                  <div key={key} className="p-3 bg-white rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-800">{key}</span>
                      <span className="text-sm text-gray-600 text-right max-w-[60%]">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Required Documents
              </CardTitle>
              <CardDescription className="text-cyan-100">Documents needed for policy application</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {insurance.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <FileText className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm text-gray-800">{doc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
