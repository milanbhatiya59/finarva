"use client"

import Link from "next/link"

export function ClientList({ clients }) {
  if (clients.length === 0) {
    return <div className="text-center py-8 text-gray-500">No clients found. Add a new client to get started.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {clients.map((client) => (
        <div
          key={client.id}
          className="bg-gray-50 overflow-hidden rounded-lg hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{client.mobileNumber}</p>
            <div className="mt-4">
              <Link
                href={`/dashboard/${client.id}`}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
