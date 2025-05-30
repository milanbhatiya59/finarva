"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Upload, User, Phone, Mail, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { MainNav } from "@/components/main-nav"

export default function NewClientPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    additionalFields: [],
    documents: [],
  })
  const [newField, setNewField] = useState({ title: "", description: "" })
  const [fileList, setFileList] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "mobileNumber") {
      const numberOnly = value.replace(/\D/g, "").slice(0, 10)
      setFormData((prev) => ({ ...prev, mobileNumber: numberOnly }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddField = () => {
    if (newField.title && newField.description) {
      setFormData((prev) => ({
        ...prev,
        additionalFields: [...prev.additionalFields, { ...newField, id: Date.now() }],
      }))
      setNewField({ title: "", description: "" })
    }
  }

  const removeField = (id) => {
    setFormData((prev) => ({
      ...prev,
      additionalFields: prev.additionalFields.filter((field) => field.id !== id),
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFileList((prev) => [...prev, ...files])
  }

  const removeFile = (index) => {
    setFileList((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.mobileNumber.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      })
      return
    }

    const newClient = {
      id: Date.now(),
      ...formData,
      documents: fileList.map((file) => file.name),
      createdAt: new Date().toISOString(),
    }

    const existingClients = JSON.parse(localStorage.getItem("clients") || "[]")
    const updatedClients = [...existingClients, newClient]
    localStorage.setItem("clients", JSON.stringify(updatedClients))

    toast({
      title: "🎉 Client added successfully!",
      description: `${formData.name} has been added to your client list.`,
    })

    router.push(`/clients/${newClient.id}`)
  }

  return (
    <div className="min-h-screen">
      <MainNav />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                New Client
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Add New Client
            </h1>
            <p className="text-gray-600">Create a new client profile with their details and documents</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription className="text-blue-100">Enter the client's primary contact details</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter client's full name"
                        className="pl-10 border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber" className="text-gray-700 font-medium">
                      Mobile Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className="pl-10 border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="client@example.com"
                      className="pl-10 border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Fields */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Additional Information
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Add custom fields for specific client details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {formData.additionalFields.length > 0 && (
                  <div className="space-y-3">
                    {formData.additionalFields.map((field, index) => (
                      <div
                        key={field.id}
                        className={`flex items-start justify-between p-4 rounded-xl border-l-4 ${
                          index % 3 === 0
                            ? "bg-blue-50 border-l-blue-400"
                            : index % 3 === 1
                              ? "bg-green-50 border-l-green-400"
                              : "bg-orange-50 border-l-orange-400"
                        }`}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{field.title}</h4>
                          <p className="text-sm text-gray-600">{field.description}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(field.id)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Field title"
                    value={newField.title}
                    onChange={(e) => setNewField((prev) => ({ ...prev, title: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                  />
                  <Input
                    placeholder="Field description"
                    value={newField.description}
                    onChange={(e) => setNewField((prev) => ({ ...prev, description: e.target.value }))}
                    className="border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddField}
                  disabled={!newField.title || !newField.description}
                  className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Documents
                </CardTitle>
                <CardDescription className="text-green-100">Upload relevant client documents</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center bg-white/50">
                  <Upload className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <Label htmlFor="documents" className="cursor-pointer">
                    <span className="text-lg font-medium text-gray-800 block">Click to upload files</span>
                    <span className="text-gray-600">or drag and drop</span>
                  </Label>
                  <Input id="documents" type="file" multiple onChange={handleFileChange} className="hidden" />
                </div>

                {fileList.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Selected Files:</Label>
                    <div className="space-y-2">
                      {fileList.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-green-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-800">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Create Client
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Link href="/">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
