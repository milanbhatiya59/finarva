"use client"

const MOCK_INSURANCES = [
  {
    id: 1,
    name: "Health Guard Gold",
    company: "ABC Insurance",
    description: "Comprehensive health coverage with no claim bonus",
    premium: 15000,
    trending: "Most Popular",
  },
  {
    id: 2,
    name: "Family Floater Plus",
    company: "XYZ Insurance",
    description: "Complete family protection with maternity benefits",
    premium: 20000,
    trending: "Best Value",
  },
]

export function RecommendedInsurance() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Insurance</h2>
      <div className="space-y-4">
        {MOCK_INSURANCES.map((insurance) => (
          <div key={insurance.id} className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900">{insurance.name}</h3>
            <p className="text-sm text-gray-500">{insurance.company}</p>
            <p className="text-sm text-gray-600 mt-2">{insurance.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">₹{insurance.premium}/year</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {insurance.trending}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
