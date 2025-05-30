"use client"

export function AgentNotes({ notes, onNotesChange }) {
  return (
    <div className="bg-white rounded-lg shadow h-[calc(100vh-8rem)]">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Agent Notes</h2>
        <textarea
          value={notes}
          onChange={onNotesChange}
          placeholder="Write your notes here..."
          className="w-full h-[calc(100vh-16rem)] p-4 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  )
}
