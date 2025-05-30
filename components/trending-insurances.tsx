"use client"

import { useRouter } from "next/navigation"

const mockTrendingInsurances = [
  {
    id: 1,
    name: "Premium Health Guard",
    company: "ABC Insurance",
    description: "Comprehensive health coverage with no claim bonus",
    premium: 15000,
    trending: "Most Popular",
    agentCommission: "15%",
    claims: "98% Settlement Rate",
  },
  {
    id: 2,
    name: "Family First Plan",
    company: "XYZ Insurance",
    description: "Complete family protection with maternity benefits",
    premium: 20000,
    trending: "Best Value",
    agentCommission: "18%",
    claims: "95% Settlement Rate",
  },
  {
    id: 3,
    name: "Senior Care Plus",
    company: "PQR Insurance",
    description: "Specialized coverage for senior citizens",
    premium: 18000,
    trending: "Top Rated",
    agentCommission: "20%",
    claims: "97% Settlement Rate",
  },
]

export function TrendingInsurances() {
  const router = useRouter()

  const handleInsuranceClick = (insuranceId) => {
    router.push(`/insurances/${insuranceId}`)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Trending Insurances</h2>
      <div className="space-y-4">
        {mockTrendingInsurances.map((insurance) => (
          <div
            key={insurance.id}
            className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
            onClick={() => handleInsuranceClick(insurance.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{insurance.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{insurance.company}</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                {insurance.trending}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-600 line-clamp-2">{insurance.description}</p>
            <div className="mt-2 flex justify-between items-center text-xs">
              <span className="text-gray-900 font-medium">₹{insurance.premium}/year</span>
              <span className="text-indigo-600">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
