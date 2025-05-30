"use client"

export function ClientProfile({ client }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Client Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Name</label>
          <p className="text-base text-gray-900">{client.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Mobile Number</label>
          <p className="text-base text-gray-900">{client.mobileNumber}</p>
        </div>
        {client.additionalFields?.map((field, index) => (
          <div key={index}>
            <label className="text-sm font-medium text-gray-500">{field.title}</label>
            <p className="text-base text-gray-900">{field.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
