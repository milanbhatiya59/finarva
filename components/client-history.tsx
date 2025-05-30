"use client"

const mockClientHistory = [
  {
    id: 1,
    name: "John Doe",
    date: "2024-03-15",
    status: "Active",
    insurance: "Health Guard Gold",
    lastAction: "Policy Renewed",
  },
  {
    id: 2,
    name: "Jane Smith",
    date: "2024-03-14",
    status: "Pending",
    insurance: "Family Floater Plus",
    lastAction: "Documents Submitted",
  },
]

export function ClientHistory() {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {mockClientHistory.map((client) => (
          <li key={client.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-indigo-600 truncate">{client.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{client.insurance}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <div className="sm:flex">
                  <p className="text-sm text-gray-500">Last Action: {client.lastAction}</p>
                </div>
                <p className="text-sm text-gray-500">{client.date}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
