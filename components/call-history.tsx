"use client"

const mockCallHistory = [
  {
    id: 1,
    clientName: "John Doe",
    date: "2024-03-15",
    duration: "15 mins",
    topic: "Policy Renewal",
    conclusion: "Client agreed to renew policy",
    reminder: "Follow up on 2024-04-15",
  },
  {
    id: 2,
    clientName: "Jane Smith",
    date: "2024-03-14",
    duration: "25 mins",
    topic: "Document Collection",
    conclusion: "Pending address proof",
    reminder: "Request documents by email",
  },
]

export function CallHistory() {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {mockCallHistory.map((call) => (
          <li key={call.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-indigo-600 truncate">Call with {call.clientName}</p>
                  <p className="mt-1 text-sm text-gray-500">Topic: {call.topic}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <p className="text-sm text-gray-500">{call.duration}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Conclusion: {call.conclusion}</p>
                {call.reminder && <p className="mt-1 text-sm text-yellow-600">Reminder: {call.reminder}</p>}
              </div>
              <div className="mt-2 text-sm text-gray-500 text-right">{call.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
