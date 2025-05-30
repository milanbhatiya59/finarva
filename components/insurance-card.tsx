"use client"

export function InsuranceCard({ insurance }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{insurance.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{insurance.company}</p>
            <p className="mt-1 text-xs text-gray-500">{insurance.type}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {insurance.trending}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-600">{insurance.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Premium</p>
            <p className="text-base font-medium text-gray-900">₹{insurance.premium}/year</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Commission</p>
            <p className="text-base font-medium text-indigo-600">{insurance.agentCommission}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Claims</p>
            <p className="text-base font-medium text-green-600">{insurance.claims}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
