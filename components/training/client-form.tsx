"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface CustomField {
    id: string
    title: string
    description: string
}

interface ClientFormData {
    name: string
    city: string
    occupation: string
    age: string
    income: string
    maritalStatus: string
    lifestyle: {
        drinking: boolean
        smoking: boolean
    }
    personality: string
    customFields: CustomField[]
    customPrompt: string
}

interface ClientFormProps {
    onSubmit: (data: ClientFormData) => void
    onCancel: () => void
}

const cityOptions = [
    { value: "tier1", label: "Tier 1 (Metro)" },
    { value: "tier2", label: "Tier 2 (Urban)" },
    { value: "tier3", label: "Tier 3 (Semi-urban)" },
    { value: "rural", label: "Rural" },
]

const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
]

const personalityOptions = [
    { value: "friendly", label: "Friendly and Open" },
    { value: "strict", label: "Strict and Formal" },
    { value: "skeptical", label: "Skeptical" },
    { value: "analytical", label: "Analytical" },
    { value: "impulsive", label: "Impulsive" },
    { value: "traditional", label: "Traditional" },
]

export function ClientForm({ onSubmit, onCancel }: ClientFormProps) {
    const [formData, setFormData] = useState<ClientFormData>({
        name: "",
        city: "",
        occupation: "",
        age: "",
        income: "",
        maritalStatus: "",
        lifestyle: {
            drinking: false,
            smoking: false,
        },
        personality: "",
        customFields: [],
        customPrompt: "",
    })

    const [newField, setNewField] = useState({ title: "", description: "" })

    const handleInputChange = (field: string, value: string | boolean | object) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAddField = () => {
        if (newField.title && newField.description) {
            setFormData((prev) => ({
                ...prev,
                customFields: [...prev.customFields, { ...newField, id: Date.now().toString() }],
            }))
            setNewField({ title: "", description: "" })
        }
    }

    const removeField = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            customFields: prev.customFields.filter((field) => field.id !== id),
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Required Parameters */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                    <CardTitle>Required Parameters</CardTitle>
                    <CardDescription className="text-blue-100">Basic client information</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className="border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City/Location *</Label>
                            <Select
                                value={formData.city}
                                onValueChange={(value) => handleInputChange("city", value)}
                                required
                            >
                                <SelectTrigger className="border-2 border-gray-200 focus:border-blue-400 rounded-xl">
                                    <SelectValue placeholder="Select city tier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cityOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age *</Label>
                            <Input
                                id="age"
                                type="number"
                                min="18"
                                max="100"
                                value={formData.age}
                                onChange={(e) => handleInputChange("age", e.target.value)}
                                className="border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="income">Annual Income (₹) *</Label>
                            <Input
                                id="income"
                                type="number"
                                min="0"
                                step="10000"
                                value={formData.income}
                                onChange={(e) => handleInputChange("income", e.target.value)}
                                className="border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                                required
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Optional Parameters */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                    <CardTitle>Optional Parameters</CardTitle>
                    <CardDescription className="text-purple-100">Additional client characteristics</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input
                                id="occupation"
                                value={formData.occupation}
                                onChange={(e) => handleInputChange("occupation", e.target.value)}
                                className="border-2 border-gray-200 focus:border-purple-400 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maritalStatus">Marital Status</Label>
                            <Select
                                value={formData.maritalStatus}
                                onValueChange={(value) => handleInputChange("maritalStatus", value)}
                            >
                                <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                                    <SelectValue placeholder="Select marital status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {maritalStatusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Lifestyle</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.lifestyle.smoking}
                                    onChange={(e) =>
                                        handleInputChange("lifestyle", { ...formData.lifestyle, smoking: e.target.checked })
                                    }
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                Smoking
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.lifestyle.drinking}
                                    onChange={(e) =>
                                        handleInputChange("lifestyle", { ...formData.lifestyle, drinking: e.target.checked })
                                    }
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                Drinking
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="personality">Personality Type</Label>
                        <Select
                            value={formData.personality}
                            onValueChange={(value) => handleInputChange("personality", value)}
                        >
                            <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                                <SelectValue placeholder="Select personality type" />
                            </SelectTrigger>
                            <SelectContent>
                                {personalityOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Custom Fields */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                    <CardTitle>Custom Fields</CardTitle>
                    <CardDescription className="text-green-100">Add your own parameters</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {formData.customFields.length > 0 && (
                        <div className="space-y-3">
                            {formData.customFields.map((field) => (
                                <div
                                    key={field.id}
                                    className="flex items-start justify-between p-4 bg-white rounded-xl border-l-4 border-green-400"
                                >
                                    <div>
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
                            className="border-2 border-gray-200 focus:border-green-400 rounded-xl"
                        />
                        <Input
                            placeholder="Field description"
                            value={newField.description}
                            onChange={(e) => setNewField((prev) => ({ ...prev, description: e.target.value }))}
                            className="border-2 border-gray-200 focus:border-green-400 rounded-xl"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddField}
                        disabled={!newField.title || !newField.description}
                        className="border-2 border-green-200 text-green-600 hover:bg-green-50"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                    </Button>
                </CardContent>
            </Card>

            {/* Custom Prompt */}
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                    <CardTitle>Custom Prompt</CardTitle>
                    <CardDescription className="text-orange-100">Additional instructions for AI behavior</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Textarea
                        value={formData.customPrompt}
                        onChange={(e) => handleInputChange("customPrompt", e.target.value)}
                        placeholder="Add any specific instructions or personality traits for the AI client..."
                        className="min-h-[100px] border-2 border-gray-200 focus:border-orange-400 rounded-xl"
                    />
                </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-3">
                <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Create AI Client
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
} 