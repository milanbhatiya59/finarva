"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewClient() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    additionalFields: [],
    documents: [],
  })

  const [newField, setNewField] = useState({ title: "", description: "" })
  const [fileList, setFileList] = useState([])
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "mobileNumber") {
      // Only allow digits and limit to 10 characters
      const numberOnly = value.replace(/\D/g, "").slice(0, 10)

      setFormData((prev) => ({
        ...prev,
        mobileNumber: numberOnly,
      }))

      // Validate the number length
      if (numberOnly.length === 0 || numberOnly.length === 10) {
        setError("")
      } else {
        setError("Phone number must be 10 digits")
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddField = () => {
    if (newField.title && newField.description) {
      setFormData((prev) => ({
        ...prev,
        additionalFields: [...prev.additionalFields, { ...newField }],
      }))
      setNewField({ title: "", description: "" })
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFileList((prevFiles) => [...prevFiles, ...files])
  }

  const removeFile = (indexToRemove) => {
    setFileList((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate phone number
    if (formData.mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    // Create new client object
    const newClient = {
      id: Date.now(), // temporary ID generation
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      additionalFields: formData.additionalFields,
      documents: fileList.map((file) => file.name), // Store file names
    }

    // Get existing clients from localStorage or initialize empty array
    const existingClients = JSON.parse(localStorage.getItem("clients") || "[]")

    // Add new client
    const updatedClients = [...existingClients, newClient]

    // Save to localStorage
    localStorage.setItem("clients", JSON.stringify(updatedClients))

    // Navigate to the new client's dashboard
    router.push(`/dashboard/${newClient.id}`)
  }

  return (
    <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Client</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              name="mobileNumber"
              id="mobileNumber"
              required
              maxLength={10}
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter 10 digit number"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Fields</h3>
          <div className="space-y-4">
            {formData.additionalFields.map((field, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h4 className="font-medium">{field.title}</h4>
                <p className="text-gray-600">{field.description}</p>
              </div>
            ))}

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Field Title"
                value={newField.title}
                onChange={(e) => setNewField((prev) => ({ ...prev, title: e.target.value }))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Field Description"
                value={newField.description}
                onChange={(e) => setNewField((prev) => ({ ...prev, description: e.target.value }))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddField}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Documents</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {fileList.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
              {fileList.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Client
          </button>
        </div>
      </form>
    </div>
  )
}
