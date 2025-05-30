"use client"

import { useState } from "react"

export function InsuranceAssistant() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: newMessage, sender: "user" },
      {
        id: Date.now() + 1,
        text: "Hello! I am your insurance assistant. How can I help you today?",
        sender: "ai",
      },
    ])
    setNewMessage("")
  }

  return (
    <div className="bg-white rounded-lg shadow h-[calc(100vh-8rem)] flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Insurance Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs rounded-lg p-3 ${
                  message.sender === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
